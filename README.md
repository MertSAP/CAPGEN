## CAPGEN
CAPGEN is a Node JS CLI that takes an input JSON file from AppTemplater and generates a working SAP CAP Application

### Installation
```
mkrdir capgen
cd capgen
git clone https://github.com/MertSAP/CAPGEN.git
npm install
```

### Execution
```
mkdir <ProjectName>
cd <ProjectName>
mkdir templateFiles

Place template File into tempalteFiles Directory
```

#### Flags:
  - f Relative path to template file - Mandatory
  - p Generates files, no proeject or directory structure - Optional
  - r EntityTechnicalName for the Root Node for the Fiori Application - Option

#### Examples
Generate a Project with a Fiori Application with Root Node Travel:
```
capgen -f loadTemplate/loadTemplate_TravelService.txt -r Travel
```
Generate a Files only
capgen -f loadTemplate/loadTemplate_TravelService.txt -p

