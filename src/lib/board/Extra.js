var ui;
var getData;

// Extends EditorUi to update I/O action states based on availability of backend
(function()
{
    // Adds required resources (disables loading of fallback properties, this can only
    // be used if we know that all keys are defined in the language specific file)
    mxResources.loadDefaultBundle = false;

    var bundle = mxResources.getDefaultBundle(RESOURCE_BASE, mxLanguage) || mxResources.getSpecialBundle(RESOURCE_BASE, mxLanguage);

    // Fixes possible asynchronous requests
    mxUtils.getAll([bundle, STYLE_PATH + '/default.xml'], function(xhr)
    {
        

        // Adds bundle text to resources
        mxResources.parse(xhr[0].getText());

        // Configures the default graph theme
        var themes = new Object();
        themes[Graph.prototype.defaultThemeName] = xhr[1].getDocumentElement(); 

        var data = `<mxGraphModel dx="1430" dy="817" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="850" pageHeight="1100" background="#ffffff"><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="2" value="Text" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;" vertex="1" parent="1"><mxGeometry x="90" y="120" width="40" height="20" as="geometry"/></mxCell><mxCell id="3" value="&lt;h1&gt;Heading&lt;/h1&gt;&lt;p&gt;Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.&lt;/p&gt;" style="text;html=1;strokeColor=none;fillColor=none;spacing=5;spacingTop=-20;whiteSpace=wrap;overflow=hidden;" vertex="1" parent="1"><mxGeometry x="210" y="70" width="190" height="120" as="geometry"/></mxCell><mxCell id="4" value="" style="ellipse;shape=doubleEllipse;whiteSpace=wrap;html=1;" vertex="1" parent="1"><mxGeometry x="110" y="170" width="120" height="80" as="geometry"/></mxCell><mxCell id="5" value="" style="rounded=1;whiteSpace=wrap;html=1;" vertex="1" parent="1"><mxGeometry x="310" y="200" width="120" height="60" as="geometry"/></mxCell><mxCell id="6" value="" style="rounded=0;whiteSpace=wrap;html=1;" vertex="1" parent="1"><mxGeometry x="150" y="320" width="120" height="60" as="geometry"/></mxCell><mxCell id="7" value="" style="shape=ext;double=1;whiteSpace=wrap;html=1;aspect=fixed;" vertex="1" parent="1"><mxGeometry x="450" y="120" width="80" height="80" as="geometry"/></mxCell><mxCell id="8" value="" style="shape=cube;whiteSpace=wrap;html=1;boundedLbl=1;" vertex="1" parent="1"><mxGeometry x="80" y="370" width="120" height="80" as="geometry"/></mxCell><mxCell id="9" value="" style="shape=internalStorage;whiteSpace=wrap;html=1;" vertex="1" parent="1"><mxGeometry x="360" y="290" width="80" height="80" as="geometry"/></mxCell></root></mxGraphModel>`

        var doc   = mxUtils.parseXml(data);
        var model = new mxGraphModel();
        var codec = new mxCodec(doc);

        codec.decode(doc.documentElement, model);

        var children = model.getChildren(model.getChildAt(model.getRoot(), 0));

        if(urlParams['preview'] == "1"){
            var graph = new Graph(document.body, null, null, null, themes);

            graph.setEnabled(false);
            graph.importCells(children);
            
        }else{
            ui = new Board(new Editor(urlParams['chrome'] == '0', themes));

            ui.actions.get('help').funct = function(){
                var ext = '';

                if (mxResources.isLanguageSupported(mxClient.language))
                {
                    ext = '_' + mxClient.language;
                }

                window.open("https://support.draw.io/display/DO/Draw.io+Online+User+Manual");
            }

            var doc = mxUtils.parseXml(data);
            ui.editor.setGraphXml(doc.documentElement);

            var compressData = ui.getCurrentCompressData();
            console.log(compressData);
            //console.log(ui.editor.graph.getDecompressData(compressData));
        }
    }, function()
    {
        document.body.innerHTML = '<center style="margin-top:10%;">Error loading resource files. Please check browser console.</center>';
    });
})();