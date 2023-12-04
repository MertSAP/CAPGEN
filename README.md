## CAPGEN
CAPGEN is a Node JS CLI that takes an input JSON file from AppTemplater and generates a working SAP CAP Application(Node.js)

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
  - p Generates files, no proeject or directory structure - Optional
  - r EntityTechnicalName for the Root Node for the Fiori Application - Option

#### Examples
Generate a Project with a Fiori Application with Root Node Travel:
```
capgen -f loadTemplate/loadTemplate_TravelService.txt -r Travel
npm install
cds watch
```
Generate a Files only
```
capgen -f loadTemplate/loadTemplate_TravelService.txt -p
```
### Limitations
- The tool currently runs CDS INIT command to generate the CAP Project Structure and some key files(Package.json), however in this version I have not managed to use the standard generators to create the UI5 Files. This means that CAPGEN only creates the minimum set of files needed, and the versions in the manifest.json file could be out of date. It is strongly recommended that you review the UI5 Files generated
