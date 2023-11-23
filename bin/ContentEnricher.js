const fs = require('fs')
const path = require('path')
module.exports = class ContentEnricher {
  constructor (templateData, RootEntityTechnicalName) {
    this.templateData = templateData
    this.rootEntityTechnicalName = RootEntityTechnicalName
  }

  getEnrichedTemplateData () {
    this.addServiceNameLowerCase()
    this.enrichFieldAssociations()
    this.enrichFacets()
    this.tracePath()
    this.setObjectPages()
    this.generateManifestData()
    this.setServiceEntities()
    //this.setEntityChildrenFlag()
    this.sortFieldsandFacets()
    this.renameAssociations()
    this.enrichValueHelp()
    this.enrichRoles()
    this.addTemplateFields(this.templateData.Services)
    this.enhanceListAndObjectPage()
    this.saveToFile()
    return this.templateData
  }

  setServiceEntities() {
    for (const entityRow of this.templateData.Services[0].to_Entity) {
      entityRow.DisplayService = false;

      if(entityRow.to_Action.length > 0) {
        entityRow.DisplayService = true
      }

      if(entityRow.EntityParentRelationships.length === 0 && !entityRow.EntityMasterData) {
        entityRow.DisplayService = true
      }
    }
  }
  /*
    Save the enriched content to a file
  */
  saveToFile () {
    const fileName = 'enriched.json'
    const reqPath = path.join(__dirname, '..', 'outputs', fileName) // It goes three folders or directories back from given __dirname.
    console.log(reqPath)
    fs.writeFile(reqPath, JSON.stringify(this.templateData, null, 4), function (err) {
      if (err) {
        return console.log(err)
      }
      console.log('The file was saved!')
    })
  }

  /*
    Sorter for Fields
  */
  sortFields () {
    return function (a, b) {
      let aSortValue = 0
      let bSortValue = 0

      if (!a.FieldisKey) {
        aSortValue = a.FieldSortOrder
      }
      if (!b.isRoot) {
        bSortValue = b.FieldSortOrder
      }
      return aSortValue - bSortValue
    }
  }

  /*
    Sorter for Facets
  */
  sortFacets () {
    return function (a, b) {
      return a.FacetSortOrder - b.FacetSortOrder
    }
  }

  /*
    Sorter for Enttities
  */
  sortEntities () {
    return function (a, b) {
      const defaultSort = 999
      let sortA = a.PathToRoot.length
      let sortB = b.PathToRoot.length

      if (sortA === 0 && a.EntityChildRelationships.length === 0) {
        // this entity has no children so put it at the bottom
        sortA = defaultSort
      }

      if (sortB === 0 && b.EntityChildRelationships.length === 0) {
        // this entity has no children so put it at the bottom
        sortB = defaultSort
      }

      return sortA - sortB
    }
  }


  enrichValueHelp () {
    for (const entityRow of this.templateData.Services[0].to_Entity) {
      for (const valueHelpRow of entityRow.to_ValueHelp) {
        let vhEntity = this.templateData.Services[0].to_Entity.find(item => {
          return item.EntityTechnicalName === valueHelpRow.ValueHelpEntity.EntityTechnicalName
        })
        valueHelpRow.ValueHelpDispayFields = []
        for(const fieldRow of vhEntity.to_Field) {
          if(fieldRow.FieldLineDisplay && !fieldRow.FieldisKey) {
            valueHelpRow.ValueHelpDispayFields.push(fieldRow)
          }
        }
      }
    }
  }

  /*
    Dive down into the json and if a array is detected add first and last booleans. 
    THis is mainly to get rid of extra commas. The is recursive and generic
  */
  addTemplateFields (Collection) {
    for (const item of Collection) {
      item.isLast = false
      if(item.isFirst === undefined) {
        item.isFirst = false
      }
     

      Object.entries(item).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          item['Has' + key] = value.length > 0
          value = this.addTemplateFields(value)
        }
      })
    }
    const arrayLength = Collection.length

    if (arrayLength > 0) {
      Collection[arrayLength - 1].isLast = true
      Collection[0].isFirst = true
    }

    return Collection
  }
  /*
    This is needed to overwrite the isLast flag as in the manfest file we want a comma after the last list 
    page and before the first objectpage
  */

  enhanceListAndObjectPage () {
    if (this.templateData.Services[0].ObjectPages.length > 0) {
      this.templateData.Services[0].ListPages[this.templateData.Services[0].ListPages.length - 1].isLast = false
    }
  }

  /*
    The templating engine doesn't like EntityTechnicalName being used at different levels
    Renaming it to Child and parent EntityTechnicalName
  */
  renameAssociations () {
    for (const entityRow of this.templateData.Services[0].to_Entity) {
      for (const childRow of entityRow.EntityChildRelationships) {
        childRow.ChildEntityTechnicalName = childRow.EntityTechnicalName
        delete childRow.EntityTechnicalName
      }

      for (const parentRow of entityRow.EntityParentRelationships) {
        parentRow.ParentEntityTechnicalName = parentRow.EntityTechnicalName
        delete parentRow.EntityTechnicalName
      }
    }
  }

  sortFieldsandFacets () {
    for (const entityRow of this.templateData.Services[0].to_Entity) {
      entityRow.to_Field.sort(this.sortFields())
      entityRow.to_Facet.sort(this.sortFacets())
    }
  }
  /*
    Need to know if an entity is Root for Fiori app
  */
  isRoot (EntityTechnicalName) {
    return (
      this.rootEntityTechnicalName === EntityTechnicalName
    )
  }

  /*
    To trace an entity back to the root is needed for manifest.json 
  */
  tracePath () {
    for (const entityRow of this.templateData.Services[0].to_Entity) {
      if (this.isRoot(entityRow.EntityTechnicalName)) {
        this.findPath(entityRow, undefined)
      }
    }

    this.templateData.Services[0].to_Entity.sort(this.sortEntities())
  }
  /*
    Recurresivly go down the tree to trace it
  */
  findPath (entity, parent) {
    if (parent !== undefined) {
      // step 1 - The path to root is the same as the parents. So copy it
      entity.PathToRoot = Object.assign(entity.PathToRoot, parent.PathToRoot)
      // step 2 - add the parent to the path
      entity.PathToRoot.push({ EntityTechnicalName: parent.EntityTechnicalName })
    }

    // now to go through the children and go down the tree

    for (const childRow of entity.EntityChildRelationships) {
      const childEntity = this.templateData.Services[0].to_Entity.find(item => {
        return item.EntityTechnicalName === childRow.EntityTechnicalName
      })
      this.findPath(childEntity, entity)
    }
  }

  setEntityChildrenFlag () {
    for (const entityRow of this.templateData.Services[0].to_Entity) {
      const HasChildren = entityRow.EntityChildRelationships.length > 0
      entityRow.HasChildren = HasChildren
    }
  }

  generateManifestData () {
    this.templateData.Services[0].ObjectPages = []
    this.templateData.Services[0].ListPages = []

    for (const entityRow of this.templateData.Services[0].to_Entity) {
      if (!entityRow.RequriesObjectPage) {
        continue
      }
      if (this.isRoot(entityRow.EntityTechnicalName)) {
        this.templateData.Services[0].ListPages.push(this.generateListEntry(entityRow))
        entityRow.EntityIsRoot = true
      }
      this.templateData.Services[0].ObjectPages.push(this.generateObjectPageEntry(entityRow))
    }
  }

  generateEntityPath (EntityTechnicalName, level) {
    if (level === 0) {
      return EntityTechnicalName + '({' + this.getEntityKeyNumber(EntityTechnicalName) + '})'
    } else {
      return '/to_' + EntityTechnicalName + '({' + this.getEntityKeyNumber(EntityTechnicalName) + '})'
    }
  }

  getEntityKeyNumber (EntityTechnicalName) {
    let index = this.templateData.Services[0].to_Entity.findIndex(
      (item) => {
        return item.EntityTechnicalName === EntityTechnicalName
      }
    )

    if (this.isRoot(this.templateData.Services[0].to_Entity[index].EntityTechnicalName)) {
      return 'key'
    }
    index++
    return 'key' + index
  }

  addObjectPageNavigation (entity, manifestFields) {
    let childIndex = 0
    for (const childRow of entity.EntityChildRelationships) {
      const childEntity = this.templateData.Services[0].to_Entity.find(
        (item) => {
          return item.EntityTechnicalName === childRow.EntityTechnicalName
        }
      )
      // let navigationLast = false;
      if ((childIndex + 1) === entity.EntityChildRelationships.length) {
        // navigationLast = true;
      }
      if (childEntity.RequriesObjectPage) {
        manifestFields.navigation.push({ assoication: 'to_' + childEntity.EntityTechnicalName, route: childEntity.EntityTechnicalName + 'ObjectPage' })
        manifestFields.hasNavigation = true
      }
      childIndex++
    }
    return manifestFields
  }

  generatePattern (entity) {
    if (this.isRoot(entity.EntityTechnicalName)) {
      return this.generateEntityPath(entity.EntityTechnicalName, 0) + ':?query:'
    }
    let level = 0
    let path = ''

    for (const ancestor of entity.PathToRoot) {
      path = path + this.generateEntityPath(ancestor.EntityTechnicalName, level)
      level++
    }
    path = path + this.generateEntityPath(entity.EntityTechnicalName, level)
    path = path + ':?query:'
    return path
  }

  generateObjectPageEntry (entity) {
    let manifestFields = {
      pattern: this.generatePattern(entity),
      name: entity.EntityTechnicalName + 'ObjectPage',
      target: entity.EntityTechnicalName + 'ObjectPage',
      isListPage: false,
      entity: entity.EntityTechnicalName,
      hasNavigation: false,
      isLast: false,
      navigation: []
    }
    manifestFields = this.addObjectPageNavigation(entity, manifestFields)
    return manifestFields
  }

  generateListEntry (entity) {
    const manifestFields = {
      pattern: ':?query:',
      name: entity.EntityTechnicalName + 'List',
      target: entity.EntityTechnicalName + 'List',
      isListPage: true,
      entity: entity.EntityTechnicalName,
      hasNavigation: true,
      isLast: false,
      navigation: [
        {
          EntityNavigation: entity.EntityTechnicalName,
          route: entity.EntityTechnicalName + 'ObjectPage'
        }
      ]
    }
    return manifestFields
  }

  setObjectPages () {
    for (const entityRow of this.templateData.Services[0].to_Entity) {
      let requriesObjectPage = entityRow.EntityRequriesFacets
      if (!requriesObjectPage) {
        if (entityRow.EntityChildRelationships.length > 0) {
          requriesObjectPage = true
        }
      }
      entityRow.RequriesObjectPage = requriesObjectPage
    }
  }

  addServiceNameLowerCase () {
    const ServiceTechnicalNameLower = this.getServiceName().toLowerCase()
    this.templateData.Services[0] = Object.assign(
      this.templateData.Services[0],
      { ServiceTechnicalNameLower }
    )
  }

  getServiceName () {
    return this.templateData.Services[0].ServiceTechnicalName
  }

  enrichFieldAssociations () {
    this.templateData.Services[0].HasCountryType = false;
    this.templateData.Services[0].HasCurrencyType = false;
    this.templateData.Services[0].HasMasterData = false;

    for (const entityRow of this.templateData.Services[0].to_Entity) {
      entityRow.PathToRoot = []

      if(entityRow.EntityMasterData) {
        this.templateData.Services[0].HasMasterData = true;
      }
      for (const fieldRow of entityRow.to_Field) {
        if (fieldRow.FieldType === 'Currency') {
          fieldRow.FieldAssocationField = 'code'
          this.templateData.Services[0].HasCurrencyType = true;
        }

        if (fieldRow.FieldType === 'Country') {
          fieldRow.FieldAssocationField = 'code'
          this.templateData.Services[0].HasCountryType = true;;
        }

        if(fieldRow.InputTypeCode === 'AutoIncrement') {
          fieldRow.FieldAutoIncrement = true
          entityRow.HasAutoIncrement = true

        }
      }
      for (const valueHelpRow of entityRow.to_ValueHelp) {
        const fieldRow = {
          FieldTechnicalName: valueHelpRow.ValueHelpTechnicalName,
          FieldLabel: valueHelpRow.ValueHelpLabel,
          FieldisKey: false,
          FieldLineDisplay: valueHelpRow.ValueHelpLineDisplay,
          FieldDetailDisplay: valueHelpRow.ValueHelpDetailDisplay,
          FieldSortOrder: valueHelpRow.ValueHelpSortOrder,
          InputTypeCode: valueHelpRow.InputTypeCode,
          Facet: valueHelpRow.Facet,
          FieldAssocationField: valueHelpRow.ValueHelpEntity.KeyField
        }
        entityRow.to_Field.push(fieldRow)
      }
    }
  }

  enrichRoles () {
    const authMap = new Map()
    let Roles = []
    if (this.templateData.Services[0].to_ServiceRole === undefined) {
      return
    }
    for (const roleRow of this.templateData.Services[0].to_ServiceRole) {
      for (const roleAuthRow of roleRow.to_ServiceAuth) {
        if (authMap.get(roleAuthRow.AuthEntity.EntityTechnicalName) === undefined) {
          authMap.set(roleAuthRow.AuthEntity.EntityTechnicalName, [])
        }

        Roles = authMap.get(roleAuthRow.AuthEntity.EntityTechnicalName)

        Roles.push({
          RoleTechnicalName: roleRow.RoleTechnicalName,
          AuthType: roleAuthRow.AuthType
        })
        authMap.set(roleAuthRow.AuthEntity.EntityTechnicalName, Roles)
      }
      // roleRow.Last = false;
    }
    if (this.templateData.Services[0].to_ServiceRole.length > 0) {
      // this.templateData.Services[0].to_ServiceRole[this.templateData.Services[0].to_ServiceRole.length - 1].Last = true;
    }
    this.templateData.Services[0].AuthbyEntity = []

    for (const [key, value] of authMap) {
      const authRole = {
        EntityTechnicalRole: key,
        Roles: value
      }
      this.templateData.Services[0].AuthbyEntity.push(authRole)
    }

    // this.templateData.Services[0].HasRoles = false;
    for (const entityRow of this.templateData.Services[0].to_Entity) {
      if (authMap.get(entityRow.EntityTechnicalName) === undefined) {
        // entityRow.EntityHasAuths = false;
      } else {
        // entityRow.EntityHasAuths = true;
        // this.templateData.Services[0].HasRoles = true;
        entityRow.EntityRoles = authMap.get(entityRow.EntityTechnicalName)
      }
    }
  }

  enrichFacets () {
    for (const entityRow of this.templateData.Services[0].to_Entity) {
      let requriesFacets = false
      for (const fieldRow of entityRow.to_Field) {
        if (fieldRow.FieldDetailDisplay) {
          requriesFacets = true
          continue
        }
      }
      entityRow.EntityRequriesFacets = requriesFacets
      if (requriesFacets) {
        const defaultFacet = {
          FacetTechnicalName: 'DefaultFacet',
          FacetSortOrder: 999,
          FacetLabel: 'General Information',
          FacetFields: []
        }

        for (const fieldRow of entityRow.to_Field) {
          fieldRow.FieldReadOnly = false
          fieldRow.FieldMandatory = false

          if (fieldRow.InputTypeCode === 'Mandatory') {
            fieldRow.FieldMandatory = true
          }

          if (fieldRow.InputTypeCode === 'ReadOnly') {
            fieldRow.FieldReadOnly = true
          }

          if (!fieldRow.FieldDetailDisplay) continue

          if (!fieldRow.InputTypeCode === 'Hidden') continue

          const facetField = {
            FieldTechnicalName: fieldRow.FieldTechnicalName
          }
          if (fieldRow.FieldAssocationField !== undefined) {
            facetField.FieldAssocationField = fieldRow.FieldAssocationField
          }

          if (fieldRow.Facet === null) {
            defaultFacet.FacetFields.push(facetField)
          }

          if (fieldRow.Facet !== null) {
            const facetRow = entityRow.to_Facet.find(item => {
              return item.FacetTechnicalName === fieldRow.Facet.FacetTechnicalName
            })

            if (facetRow.FacetFields === undefined) {
              facetRow.FacetFields = []
            }

            facetRow.FacetFields.push(facetField)
          }
        }
        /*
      let firstPass = true;
      for(let facetRow of entityRow.to_Facet) {
        facetRow.FacetFields = [];

        for (let fieldRow of entityRow.to_Field) {
          var facetField = {
            FieldTechnicalName: fieldRow.FieldTechnicalName,
          }
          if(fieldRow.FieldAssocationField !== undefined) {
            facetField.FieldAssocationField = fieldRow.FieldAssocationField;
          }
          if( fieldRow.Facet !== null && fieldRow.Facet.FacetTechnicalName === facetRow.FacetTechnicalName) {
            facetRow.FacetFields.push(facetField);
          } else if(fieldRow.Facet === null &&firstPass) {
            defaultFacet.FacetFields.push(facetField);
          }
        }

        firstPass = false;

      } */
        if (defaultFacet.FacetFields.length > 0) {
          entityRow.to_Facet.push(defaultFacet)
        }
      }
    }
  }

  enrichFacetAssociations () {
    let entityIndex = 0
    for (const entity of this.templateData.Services[0].Entities) {
      for (const field of entity.EntityFields) {
        if (field.FieldAssocationField !== '' && field.FieldDetailDisplay) {
          let EntityFacetIndex = 0
          for (const EntityFacet of entity.EntityFacets) {
            let fieldFacetIndex = 0
            for (let FacetField of EntityFacet.FacetFields) {
              if (FacetField.FieldTechnicalName === field.FieldTechnicalName) {
                FacetField = Object.assign(
                  { FieldAssocationField: field.FieldAssocationField },
                  FacetField
                )
                this.templateData.Services[0].Entities[
                  entityIndex
                ].EntityFacets[EntityFacetIndex].FacetFields[fieldFacetIndex] =
                  FacetField
              }
              fieldFacetIndex++
            }
            EntityFacetIndex++
          }
        }
      }
      for (const field of entity.EntityKeyFields) {
        if (field.FieldAssocationField !== '' && field.FieldDetailDisplay) {
          let EntityFacetIndex = 0
          for (const EntityFacet of entity.EntityFacets) {
            let fieldFacetIndex = 0
            for (let FacetField of EntityFacet.FacetFields) {
              if (FacetField.FieldTechnicalName === field.FieldTechnicalName) {
                FacetField = Object.assign(
                  { FieldAssocationField: field.FieldAssocationField },
                  FacetField
                )
                this.templateData.Services[0].Entities[
                  entityIndex
                ].EntityFacets[EntityFacetIndex].FacetFields[fieldFacetIndex] =
                  FacetField
                EntityFacetIndex = -10
                return
              }
              fieldFacetIndex++
            }
            if (EntityFacetIndex < 0) {
              return
            }
            EntityFacetIndex++
          }
        }
      }
      entityIndex++
    }
  }
}
