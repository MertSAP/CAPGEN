## CAPGEN
CAPGEN is a Node.js CLI that takes an input JSON file from AppTemplater and generates a working SAP CAP Application(Node.js)

### Demo
https://www.youtube.com/watch?v=mF02MeVATZw
### Getting Started
```
git clone https://github.com/MertSAP/CAPGEN.git
cd CAPGEN
npm install
npm install -g
```

### Execution
```
mkdir <ProjectName>
cd <ProjectName>
mkdir loadTemplate

Place template File into loadTemplate Directory
```

#### Flags:
  - f Relative path to template file - Mandatory
  - p Generates files, no project or directory structure - Optional
  - r EntityTechnicalName for the Root Node for the Fiori Application - Option
   -u Update Mode. To be used to regenerate files if CAPGEN has already executed but the template file has been changed
#### Examples
Generate a Project with a Fiori Application with Root Node Travel:
```
capgen -f loadTemplate/loadTemplate_TravelService.txt -r Travel
npm install
cds watch
```

Updates an existing project created from CAPGEN(If there are updates to the template file)
```
capgen -f loadTemplate/loadTemplate_TravelService.txt -r Travel -u
```

Generate a Files only
```
capgen -f loadTemplate/loadTemplate_TravelService.txt -p
```
