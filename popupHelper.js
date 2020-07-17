// The template is very simple - all this does is say 'when you click a feature, pass that feature to the 'createCustomPopupContent' function and have it return content for this popup'.

var DeviceFootprintsLyr_modularTemplate = {
  content: createCustomPopupContent
}

//////////////////////////////////////////////////////////////////////////////////////////////
// Define which elements to include in the pop-up based on feature attributes.
//////////////////////////////////////////////////////////////////////////////////////////////

function createCustomPopupContent(feature) {
  // This function builds a JSON object of Esri Popup elements using JavaScript. As far as the popup template above is concerned, that JSON object could be written in the code as it was before or created on the fly - all it knows is that when it tries to load up the popup, that content is sitting in its 'content' property on line 5.

  // This is a supported Esri workflow, so they've actually made the template provide this function with the appropriate clicked feature. We can build our template by looking at field values in that feature, then using them to create new Popup elements. Finally, we combine all of these together and return them to the popup.

  // Note that we could return an HTML 'div' instead - this would let us create a full on custom sidebar with HTML and JavaScript, rather than relying on the Esri popup templates we're building below. If it isn't possible to get images working this way, that's what we'll need to do.


  content = [];
  let graphic = feature.graphic;
  let featureAttributes = graphic.attributes;


  if (true) { // Set criteria for adding this element if desired.
    content.push(makeProjectTitleElement(featureAttributes.DEVICE_MEL_ID, featureAttributes.ESTIMATED_DEVICE_TYPE));
  }


  if (true) { // Set criteria for adding this element if desired.
    content.push(makeProjectFieldTableElement());
  }



  if (true) {
    content.push(makeZoomToRelatedDataButton());
  }

  return (content);
}



function popupButtonClickEvent(clickedButton) {
  clickedButton.dispatchEvent(new CustomEvent("popupButtonClickEvent", {bubbles: true}));
}

//////////////////////////////////////////////////////////////////////////////////////////////
// Write the actual template elements here. These take attributes & return Esri Popup elements.
//////////////////////////////////////////////////////////////////////////////////////////////



function makeProjectTitleElement(deviceID, ProjectName) {
  return ({
    type: "text",
    text: `<font color="#c94600"><h1><b>${deviceID}</b></h1><h2><br>Estimated Device Type: ${ProjectName}</h2></font>`
  });
}



function makeProjectFieldTableElement() {
  return ({
    type: "fields",
    fieldInfos: [{
      fieldName: "DEVICE_AREA",
      label: "Device Area (m2)"
    },

    {
      fieldName: "MEAN",
      label: "Footprint Elevation"
    },

    {
      fieldName: "ESTIMATED_DEVICE_TYPE",
      label: "Estimated Device Type"
    },

    {
      fieldName: "ESTIMATED_CATCHMENT_AREA",
      label: "Estimated Catchment Area"
    },

    {
      fieldName: "OFFTAKE_SLOPE",
      label: "Offtake Pipe Slope"
    },

    {
      fieldName: "OFFTAKE_PIPE_DIST",
      label: "Offtake Pipe Slope"
    }
    ]
  });
}

function makeZoomToRelatedDataButton() {
  return ({
    type: "text",
    text: `<button type="button" class="zoomToRelatedDataButton" value="relatedDataAction" onclick="popupButtonClickEvent(this)">View estimated catchment area</button>`
  });
}