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

  if (true) {
    content.push(makeChart());
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
    text: `<font color="#c94600"><h1><b>Device Opportunity: ${deviceID}</b></h1><h2><br>Estimated Device Type: ${ProjectName}</h2></font>`
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
    text: `<p align="center"><button type="button" class="zoomToRelatedDataButton" value="relatedDataAction" onclick="popupButtonClickEvent(this)">View estimated catchment area</button></p>`
  });
}

function makeChart() {
  return (
    {
      // You can set a media element within the popup as well. This
      // can be either an image or a chart. You specify this within
      // the mediaInfos. The following creates a pie chart in addition
      // to two separate images. The chart is also set up to work with
      // related tables. Similar to text elements, media can only be set within the content.
      type: "media", // MediaContentElement
      mediaInfos: [
        // {
        //   title: "<b>Count by type</b>",
        //   type: "pie-chart",
        //   caption: "",
        //   value: {
        //     fields: ["OFFTAKE_SLOPE"],
        //     normalizeField: null
            
        //   }
        // },
        {
          title: "<b>Landuse Split</b>",
          type: "image",
          caption: "",
          value: {
            sourceURL:
            // "https://d33v4339jhl8k0.cloudfront.net/docs/assets/588089eddd8c8e484b24e90a/images/5c3369bc2c7d3a31944fbdb3/file-MHQmQt9AT2.png"
              "https://chart.googleapis.com/chart?cht=p&chs=300x250&chd=t:{CHART_VALUES}&chl={CHART_CATEGORIES}"
          }
        }

      ]
    }

  );
}





// {
//   // You can set a media element within the popup as well. This
//   // can be either an image or a chart. You specify this within
//   // the mediaInfos. The following creates a pie chart in addition
//   // to two separate images. The chart is also set up to work with
//   // related tables. Similar to text elements, media can only be set within the content.
//   type: "media", // MediaContentElement
//   mediaInfos: [
//     {
//       title: "<b>Count by type</b>",
//       type: "pie-chart",
//       caption: "",
//       value: {
//         fields: ["relationships/0/Point_Count_COMMON"],
//         normalizeField: null,
//         tooltipField: "relationships/0/COMMON"
//       }
//     },
//     {
//       title: "<b>Mexican Fan Palm</b>",
//       type: "image",
//       caption: "tree species",
//       value: {
//         sourceURL:
//           "https://www.sunset.com/wp-content/uploads/96006df453533f4c982212b8cc7882f5-800x0-c-default.jpg"
//       }
//     },
//     {
//       title: "<b>Indian Laurel Fig</b>",
//       caption: "tree species",
//       value: {
//         sourceURL:
//           "https://selectree.calpoly.edu/images/0600/09/original/ficus-microcarpa-tree-3.jpg"
//       }
//     }
//   ]
// }