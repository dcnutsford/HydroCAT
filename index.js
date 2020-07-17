require([
  "lodash/lodash.min",
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/widgets/BasemapToggle",
  "esri/widgets/BasemapGallery",
  "esri/widgets/LayerList",
  "esri/layers/GroupLayer",
  "esri/widgets/Search",
  "esri/widgets/Expand",
  "esri/tasks/Locator",
  "esri/widgets/Swipe",
  "esri/widgets/Legend",
  "esri/layers/MapImageLayer",
  "esri/layers/TileLayer",
  "esri/Basemap",
  "esri/geometry/Point",
  "esri/core/watchUtils",
  "./popupHelper.js"

], function (_, Map, MapView, FeatureLayer, BasemapToggle, BasemapGallery, LayerList, GroupLayer, Search, Expand, Locator, Swipe, Legend, MapImageLayer, TileLayer, Basemap, Point, watchUtils, popupHelper) {

  //Projects Data All
  const DeviceFootprintsLyr = new FeatureLayer({
    //url: "https://services9.arcgis.com/BASIbNEHthKXyrBZ/arcgis/rest/services/WRA_Projects_MASTER_v1_SampleView/FeatureServer/0",
    url: "https://services2.arcgis.com/l6OZbMyD4V8U0XaZ/arcgis/rest/services/P02462_Explicit_Devices_Catchment_Review/FeatureServer/4",
    visible: true,
    outFields: ["*"],
    title: "All Projects",
    labelsVisible: false,
    popupTemplate: DeviceFootprintsLyr_modularTemplate
  });

  const WinnerDeviceOfftakePointsLyr = new FeatureLayer({
    //url: "https://services9.arcgis.com/BASIbNEHthKXyrBZ/arcgis/rest/services/WRA_Projects_MASTER_v1_SampleView/FeatureServer/0",
    url: "https://services2.arcgis.com/l6OZbMyD4V8U0XaZ/arcgis/rest/services/P02462_Explicit_Devices_Catchment_Review/FeatureServer/1",
    visible: true,
    outFields: ["*"],
    title: "Best Offtake Points",
    labelsVisible: false,
    popupTemplate: DeviceFootprintsLyr_modularTemplate
  });

  const AllDeviceOfftakePointsLyr = new FeatureLayer({
    //url: "https://services9.arcgis.com/BASIbNEHthKXyrBZ/arcgis/rest/services/WRA_Projects_MASTER_v1_SampleView/FeatureServer/0",
    url: "https://services2.arcgis.com/l6OZbMyD4V8U0XaZ/arcgis/rest/services/P02462_Explicit_Devices_Catchment_Review/FeatureServer/2",
    visible: false,
    outFields: ["*"],
    title: "All Offtake Points",
    labelsVisible: false,
    popupTemplate: DeviceFootprintsLyr_modularTemplate
  });


  const DeviceOfftakeLinesLyr = new FeatureLayer({
    //url: "https://services9.arcgis.com/BASIbNEHthKXyrBZ/arcgis/rest/services/WRA_Projects_MASTER_v1_SampleView/FeatureServer/0",
    url: "https://services2.arcgis.com/l6OZbMyD4V8U0XaZ/arcgis/rest/services/P02462_Explicit_Devices_Catchment_Review/FeatureServer/3",
    visible: true,
    outFields: ["*"],
    title: "Offtake Lines",
    labelsVisible: false,
    popupTemplate: DeviceFootprintsLyr_modularTemplate
  });

  const Catchments = new FeatureLayer({
    //url: "https://services9.arcgis.com/BASIbNEHthKXyrBZ/arcgis/rest/services/WRA_Projects_MASTER_v1_SampleView/FeatureServer/0",
    url: "https://services2.arcgis.com/l6OZbMyD4V8U0XaZ/arcgis/rest/services/P02462_Explicit_Devices_Catchment_Review/FeatureServer/0",
    visible: false,
    outFields: ["*"],
    title: "Catchments",
    labelsVisible: true,
    popupTemplate: DeviceFootprintsLyr_modularTemplate
  });

  const undergroundServices = new MapImageLayer({
    //url: "https://services9.arcgis.com/BASIbNEHthKXyrBZ/arcgis/rest/services/WRA_Projects_MASTER_v1_SampleView/FeatureServer/0",
    url: "https://mapspublic.aucklandcouncil.govt.nz/arcgis/rest/services/LiveMaps/UndergroundServices/MapServer",
    visible: true,
    title: "Stormwater Services",   
    
  });  



  var Hillshade = new TileLayer({
    url: "  https://services1.arcgisonline.co.nz/arcgis/rest/services/Elevation/New_Zealand_Hillshade/MapServer",
    opacity: 0.5
    });
    // Add layer to map


  const basemap_nztm = new TileLayer({
    // URL points to a cached tiled map service hosted on ArcGIS Server
    url: "https://services.arcgisonline.co.nz/arcgis/rest/services/Imagery/newzealand/MapServer"
  });

  var customBasemap = new Basemap({
    baseLayers: [basemap_nztm],
    title: "Custom Basemap",
    id: "myBasemap"
  });


  const map = new Map({
    basemap: customBasemap,
    layers: [Hillshade,Catchments, undergroundServices,DeviceFootprintsLyr,AllDeviceOfftakePointsLyr,DeviceOfftakeLinesLyr,WinnerDeviceOfftakePointsLyr]
  });


  const view = new MapView({
    container: "viewDiv",
    popup: {
      dockEnabled: true,
      dockOptions: {
        // Disables the dock button from the popup
        buttonEnabled: false,
        // Ignore the default sizes that trigger responsive docking
        breakpoint: false,
        position: "top-left"
      }
    },
    map: map,
    center: new Point({ "x": 1770172.87, "y": 5913300.28, "spatialReference": { "wkid": 2193 } }),
    zoom: 11,
    highlightOptions: {
      color: "white",
      haloOpacity: 1,
      fillOpacity: 0.4

    }
  });

  //Remove the Zoom option from Popup
  view.popup.viewModel.actions.getItemAt(0).visible = false;

  // Catchments.visible = false

  //Configure Map Widgets
  //Basemap Toggle
  var basemapToggle = new BasemapToggle({
    view: view,
    nextBasemap: "gray"
  });
  view.ui.add(basemapToggle, "bottom-right");

  //LayerList
  var layerList = new LayerList({
    view: view,
    listItemCreatedFunction: layerListLayerSetup
  });

  view.ui.add(layerList, {
    position: "top-right"
  });

  //Search Widget
  // Geocoder
  const sources = [
    {
      layer: DeviceFootprintsLyr,
      searchFields: ["DEVICE_MEL_ID"],
      displayField: "DEVICE_MEL_ID",
      exactMatch: false,
      outFields: ["*"],
      name: "WRA  Projects",
      placeholder: "example: esri",
      maxResults: 6,
      maxSuggestions: 6,
      suggestionsEnabled: true,
      minSuggestCharacters: 0
    },
  ];

  // Search
  const searchWidget = new Search({
    view: view,
    label: 'Search by Project Code or Address',
    sources: sources,
    includeDefaultSources: true
  });

  searchWidgetExpand = new Expand({
    expandIconClass: "esri-icon-search",
    expandTooltip: searchWidget.label,
    view: view,
    content: searchWidget,
    //group: "top-right"
  });

  view.ui.add(searchWidgetExpand, {
    position: "top-right",
    index: 1
  });


  const legendWidget = new Legend({
    view: view,
    label: "Click to Expand Legend",
    respectLayerVisibility: false,
  });

  legendWidgetExpand = new Expand({
    expandIconClass: "esri-icon-layers",
    expandTooltip: legendWidget.label,
    view: view,
    content: legendWidget,
    //group: "top-right"
  });
  
  view.ui.add(legendWidgetExpand, "bottom-left");

  //Add html Widgets
  view.ui.add("info", "top-left");

  var listOfLayers = [];
  function layerListLayerSetup(event) {

    let target = event.item;
    if (target.layer.type != "group") {
      // don't show legend twice
      target.panel = {
        content: "legend",
        open: false
      };
    }

    if (!(listOfLayers.includes(target.layer.id))) {
      listOfLayers.push(target.layer.id);
      target.watch("visible", layerInLayerListToggled);
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  // Control popups & highlighting of visible layers.
  //////////////////////////////////////////////////////////////////////////////////////////////

  // Set the layer to initially enable highlights and popups for on load.
  var interactiveLayer = DeviceFootprintsLyr; // Set the default interactive layer here.
  var interactiveLayerView;
  var relatedDataLayer = Catchments;
  var relatedDataLayer2 = AllDeviceOfftakePointsLyr;
  var relatedDataLayerView;
  var relatedDataLayerView2;
  var highlightObject;
  var currentlyHighlightedFeatures = [];

  // Wait for the view to finish loading in.
  view.when(function () {

    // Grab the layerView of the default selectable layer (this should already have loaded).
    view.whenLayerView(interactiveLayer).then(function (layerView) {
      interactiveLayerView = layerView;
      view.on("pointer-move", highlightProjectsOnHover);
    });

    view.whenLayerView(relatedDataLayer).then(function (layerView) {
      relatedDataLayerView = layerView;
    });

    view.whenLayerView(relatedDataLayer2).then(function (layerView) {
      relatedDataLayerView2 = layerView;
    });    

    // Hide related data whenever the popup is closed. 
    view.popup.watch("visible", function (newValue) {
      if (newValue === false) {
        clearAndHideRelatedData();
      }
    });

    // Listen for custom popup button click events defined in popupHelper.js.
    document.addEventListener("popupButtonClickEvent", function (evt) {
      let clickedButton = evt.target;

      // Call the appropriate function based on button's value (set in popupHelper.js). 
      switch (clickedButton.value) {
        case "relatedDataAction":
          popupActionRelatedData();
      }
    });
  });

  function highlightProjectsOnHover(mouseCursorEvent) {

    view.hitTest(mouseCursorEvent).then(function (hitTestResultsArray) {
      if (hitTestResultsArray.results.length > 0) {
        let featuresToHighlight = hitTestResultsArray.results.filter(function (hitFeature) {
          return (hitFeature.graphic.layer.id === interactiveLayer.id); // Check if groupLayerIsVisible.
        });
        if (featuresToHighlight.length > 0) {
          let idsOfFeaturesToHighlight = featuresToHighlight.map(function (feature) {
            return (feature.graphic.attributes.OBJECTID);
          })
          if (!(_.isEqual(currentlyHighlightedFeatures.sort(), idsOfFeaturesToHighlight.sort()))) {
            clearHighlightedFeatures();
            setAndShowInfoTooltip(featuresToHighlight[0]);
            currentlyHighlightedFeatures = idsOfFeaturesToHighlight;
            highlightObject = highlightFeatures(idsOfFeaturesToHighlight);
          }
        } else {
          hideInfoTooltip();
          clearHighlightedFeatures();
        }
      } else {
        hideInfoTooltip();
        clearHighlightedFeatures();
      }
    });
  }

  function highlightFeatures(idsOfFeaturesToHighlight) {
    returnval = (interactiveLayerView.highlight(idsOfFeaturesToHighlight));
    return returnval;
  }

  function clearHighlightedFeatures() {
    currentlyHighlightedFeatures = [];
    if (highlightObject) {
      highlightObject.remove();
    }
  }

  function setAndShowInfoTooltip(feature) {
    let projectNumber = feature.graphic.attributes.DEVICE_MEL_ID;
    let projectName = feature.graphic.attributes.DEVICE_STATUS;
    document.getElementById("Project_Number_Hover").innerHTML = "<b>" + projectNumber + "</b>" + "<br>" + projectName;
    document.getElementById("info").style.visibility = "visible";
  }

  function hideInfoTooltip() {
    document.getElementById("info").style.visibility = "hidden";
  }

  // Popup button action functions.
  function popupActionRelatedData() {
    clearAndHideRelatedData();
    relatedDataLayerView.visible = true;
    relatedDataLayerView2.visible = true;
    console.log(relatedDataLayerView);
    let feature = view.popup.content.graphic;
    let projectNumber = feature.attributes.DEVICE_MEL_ID;
    let expression = "DEVICE_MEL_ID = " + projectNumber

    relatedDataLayerView.filter = {
      where: expression
      
    }

    relatedDataLayerView2.filter = {
      where: expression
      
    }
    relatedDataLayerView.queryExtent()
      .then(function (queryResponse) {
        if (queryResponse.count > 0) {
          console.log("Query sorted.");
          console.log(queryResponse);
          view.goTo(queryResponse.extent);
        } else {
          console.log("No count.");
          console.log(expression);
          relatedDataLayerView.visible = false;
          relatedDataLayerView2.visible = false;
          // relatedDataLayerView2.visible = true;
        }
      });
  }

  function clearAndHideRelatedData() {
    relatedDataLayerView.filter = {
      where: "' '"
    }
    relatedDataLayerView2.filter = {
      where: "' '"
    }
    relatedDataLayerView.visible = false;
    relatedDataLayerView2.visible = false;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  // Limit the user to one visible projects-based layer at a time. Reference layers unaffected.
  //////////////////////////////////////////////////////////////////////////////////////////////

  // IMPORTANT: UID & ID fields are not unique (because we're adding the same layer multiple times with different names). 
  // As a result, we're judging uniqueness by layer/group layer title. All titles must therefore be unique.

  // Titles of group layers to be included in the 'one unique layer at a time' logic.
  groupLayersLimitedToOneVisibleLayer = [
    // projectsYearGroupLayer.title,
    // projectsStatusGroupLayer.title,
    // projectsIwiAffiliationGroupLayer.title,
    // projectsTypeGroupLayer.title
  ];

  function getRootLayerFromNested(layer) {
    currentLayer = layer;
    while (!(currentLayer.parent.basemap)) {
      currentLayer = currentLayer.parent;
    }
    return currentLayer;
  }

  function layerInLayerListToggled(newValue, oldValue, propertyName, target) {

    if ((target.layer.type === 'group' && groupLayersLimitedToOneVisibleLayer.includes(target.layer.title)) ||
      (target.layer.type === 'feature' && groupLayersLimitedToOneVisibleLayer.includes(getRootLayerFromNested(target.layer).title))) {
      view.popup.close();
      clearAndHideRelatedData();
      if (newValue === true) {
        layerList.viewModel.operationalItems.items.forEach(function (topLevelLayer) {
          if (groupLayersLimitedToOneVisibleLayer.includes(topLevelLayer.title)) {
            if (!(topLevelLayer.layer.id == target.layer.id)) {
              parentOfVisibleLayer = false;
              topLevelLayer.layer.layers.forEach(function (layer) {
                if (target.layer.id == layer.id) {
                  parentOfVisibleLayer = true;
                  layer.visible = true;
                  interactiveLayer = layer;
                  view.allLayerViews.forEach(function (layerView) {
                    if (layerView.layer.id === interactiveLayer.id) {
                      interactiveLayerView = layerView;
                    }
                  });
                } else {
                  layer.visible = false;
                }
              });
              topLevelLayer.visible = parentOfVisibleLayer ? true : false;
            }
          }
        });
      }
    }
  }
});