using { sap, managed } from '@sap/cds/common';

aspect custom.managed {
  createdAt     : managed:createdAt;
  createdBy     : managed:createdBy;
  LastChangedAt : managed:modifiedAt;
  LastChangedBy : managed:modifiedBy;
}
