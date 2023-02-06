var configJson = {};
            var notification = document.getElementById("notification");
            var notificationText = document.getElementById("notification-text");
      
            autosize(document.getElementById("embedViewer_description"));
      
            function sleep (time) {
              return new Promise((resolve) => setTimeout(resolve, time));
            }
      
            function showNotification(delay, text) {
                alert(text)
            }

            function getDomains() {
              var domainSelect = document.getElementById("domain-select")
              $.get("/api/domains", (data, status) => {
                data.forEach(item => {
                  var el = document.createElement("option")
                  el.value = item
                  el.innerText = item
                  domainSelect.appendChild(el)
                })
              })
            }
      
            function generateConfig() {
              var configResultTextarea = document.getElementById('config-result');
      
              var uploadKey = document.getElementById('upload-key');
      
              var embeds = document.getElementById('embeds-checkbox');
              var embedAuthor = document.getElementById('embedViewer_author');
              var embedTitle = document.getElementById('embedViewer_title');
              var embedDescription = document.getElementById('embedViewer_description');
              var embedColour = document.getElementById('embedColour-text');
              var domain = document.getElementById("domain-select").value
              var subdomain = document.getElementById("subdomain-input").value
      
              if (!embeds.checked) {
                embedAuthor2 = "";
                embedTitle2 = "";
                embedDescription2 = "";
                embedColour2 = "";
              } else {
                embedAuthor2 = embedAuthor.value;
                embedTitle2 = embedTitle.value;
                embedDescription2 = embedDescription.value;
                embedColour2 = embedColour.value;                  
              }
      
              config = {
                          "Version": "13.4.0",
                          "Name": "hypixel.lol",
                          "DestinationType": "ImageUploader, FileUploader",
                          "RequestMethod": "POST",
                          "RequestURL": "<%=mainDomain%>/upload",
                          "Body": "MultipartFormData",
                          "Arguments": {
                            "upload-key": uploadKey.value,
                            "embed-author": embedAuthor2,
                            "embed-title": embedTitle2,
                            "embed-description": embedDescription2,
                            "embed-colour": embedColour2,
                            "domain": domain,
                            "subdomain": subdomain 
                          },
                          "FileFormName": "file"
                        }
      
              configJson = JSON.stringify(config, null, 2);
      
              configResultTextarea.value = JSON.stringify(config, null, 2);
      
              setTimeout(generateConfig, 1);
            }
      
            function downloadConfig() {
              var uploadKey = document.getElementById('upload-key');
              var filenameLength = document.getElementById('filename-length');
      
              if (uploadKey.value == "" || uploadKey.value == null) {
                showNotification(1750, "Cant download your config because you didnt fill in your upload key.")
                return;
              }
      
              var filename = "config.sxcu";
              var text = configJson;
              var element = document.createElement('a');
      
              element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
              element.setAttribute('download', filename);
      
              element.style.display = 'none';
              document.body.appendChild(element);
      
              element.click();
      
              document.body.removeChild(element);
            }
      
            function updateEmbedColour() {
              var colourPicker = document.getElementById("embedColour");
              var colourValue = document.getElementById("embedColour-text");
              var colourWrapper = document.getElementById("embedColour-wrapper");
      
              colourValue.value = colourPicker.value;
              $('#embedViewer').css('border-left', "4px solid " + colourPicker.value);
              $('#embedColour-wrapper').css('background', colourValue.value);
      
              setTimeout(updateEmbedColour, 1);
            }
      
            function checkEmbedEnabled() {
              var checkbox = document.getElementById('embeds-checkbox');
              $("#embedViewer_description").show();
      
              if (checkbox.checked) {
                $("#embedViewer-wrapper").show();
              } else {
                $("#embedViewer-wrapper").hide();
              }
      
              setTimeout(checkEmbedEnabled, 1);
            }
      
            checkEmbedEnabled();
            updateEmbedColour();
            generateConfig();
            getDomains()