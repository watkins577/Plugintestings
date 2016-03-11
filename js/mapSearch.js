var polygon;
var drawingManager;
var markers = [];
var serializedPoly;

var mapDefaults = {
    "lat": 51.620472,
    "lng": -3.932997,
    "zoom": 11,
    strokeColor: "#647393",
    fillColor: "#647393",
    editable: true,
    propertyIcon: "Images/home.png",
    branchIcon: "Images/agent.png",
    showTotals: true,
    useBalloonPop: true,
    alternativeResultLocation: 'popup', // ID of div to write the results to if you aren't using the popup
    useOfficeBalloonPop: true,
    results: {
        "showPicture": true,
        "imageWidth": 150,
        "showPrice": true,
        "showBedroomCount": false,
        "showRecepCount": false,
        "showBathCount": false,
        "showGarageCount": false,
        "showUseAddress": false,
        "showNameNum": false,
        "showSA1": true,
        "showSA2": true,
        "showTown": false,
        "showCity": false,
        "showCounty": false,
        "showCountry": false,
        "showPC": false,
        "showSummary": true,
        "showLike": true,
        "showLink": true
    },
    officeDetails: {
        "showLogo": true,
        "LogoSize": 150,
        "showBranchName": false,
        "showSA1": false,
        "showSA2": false,
        "showTown": false,
        "showCity": false,
        "showCounty": false,
        "showCountry": false,
        "showPC": false,
        "showTel1": true,
        "showTel2": false,
        "showFax1": true,
        "showFax2": false,
        "showEmail": true,
        "showURL": false
    }
};

function noProperties() 
{
    alert("There are no properties available");
}

function generateResult(i)
{
    var ret = "<div id=\"result\">";
    if (mapDefaults.results.showPicture) {
        ret += "<div class=\"smlPhoto\">" + propertyImage(mapProps.properties[i], mapDefaults.results.imageWidth, mapProps.properties[i].status, mapProps.properties[i].uola, mapProps.properties[i].rentalPeriod) + "</div>";
    }
    if (mapDefaults.results.showUseAddress) {
        ret += "<div class=\"useAddress \">" + mapProps.properties[i].useAddress + "</div>";
    }
    if (mapDefaults.results.showSA1) {
        ret += "<div class=\"sa1\">" + mapProps.properties[i].sa1 + "</div>";
    }
    if (mapDefaults.results.showSA2) {
        ret += "<div class=\"sa2\">" + mapProps.properties[i].sa2 + "</div>";
    }
    if (mapDefaults.results.showTown) {
        ret += "<div class=\"town\">" + mapProps.properties[i].town + "</div>";
    }
    if (mapDefaults.results.showCity) {
        ret += "<div class=\"city\">" + mapProps.properties[i].city + "</div>";
    }
    if (mapDefaults.results.showCounty) {
        ret += "<div class=\"county\">" + mapProps.properties[i].county + "</div>";
    }
    if (mapDefaults.results.showCountry) {
        ret += "<div class=\"country\">" + mapProps.properties[i].country + "</div>";
    }
    if (mapDefaults.results.showPC) {
        ret += "<div class=\"postcode\">" + mapProps.properties[i].postcode + "</div>";
    }
    if (mapDefaults.results.showPrice) {
        var rentalperiodText = "";
        if (mapProps.properties[i].rentalPeriod == 2) {
            rentalperiodText = "per day";
        }
        else if (mapProps.properties[i].rentalPeriod == 3) {
            rentalperiodText = "per week";
        }
        else if (mapProps.properties[i].rentalPeriod == 4) {
            rentalperiodText = "pcm";
        }
        else if (mapProps.properties[i].rentalPeriod == 5) {
            rentalperiodText = "per quarter";
        }
        else if (mapProps.properties[i].rentalPeriod == 6) {
            rentalperiodText = "per year";
        }
        ret += "<div class=\"price\">" + mapProps.properties[i].price + " " + rentalperiodText + "</div>";
    }
    if (mapDefaults.results.showBedroomCount) {
        ret += "<div class=\"beds\">Bedrooms:" + mapProps.properties[i].beds + "</div>";
    }
    if (mapDefaults.results.showRecepCount) {
        ret += "<div class=\"receps\">Receptions:" + mapProps.properties[i].receps + "</div>";
    }
    if (mapDefaults.results.showBathCount) {
        ret += "<div class=\"baths\">Bathrooms:" + mapProps.properties[i].baths + "</div>";
    }
    if (mapDefaults.results.showSummary) {
        ret += "<div class=\"summary\">" + mapProps.properties[i].summary + "</div>";
    }
    if (mapDefaults.results.showLike) {
        ret += "<div class=\"moredetails\">" + propertyLike(mapProps.properties[i]) + "</div>";
    }
    if (mapDefaults.results.showLink) {
        ret += "<div class=\"moredetails\">" + propertyLink(mapProps.properties[i]) + "</div>";
    }
    ret += "</div>";
    return ret;
}

function generateBranchDetails(i)
{
    var ret = "<div id=\"branch\">";
            if (mapDefaults.officeDetails.showLogo)
            {
                ret += "<div class=\"branchLogo\">" + branchLogo(i, mapDefaults.officeDetails.LogoSize) + "</div>";
            }
            if (mapDefaults.officeDetails.showBranchName)
            {
                ret += "<div class=\"branchName\">" + mapProps.branches[i].name + "</div>";
            }
            if (mapDefaults.officeDetails.showSA1)
            {
                ret += "<div class=\"branchSA1\">" + mapProps.branches[i].streetaddress1 + "</div>";
            }
            if (mapDefaults.officeDetails.showSA2)
            {
                ret += "<div class=\"branchSA2\">" + mapProps.branches[i].streetaddress2 + "</div>";
            }
            if (mapDefaults.officeDetails.showTown)
            {
                ret += "<div class=\"branchTown\">" + mapProps.branches[i].town + "</div>";
            }
            if (mapDefaults.officeDetails.showCity)
            {
                ret += "<div class=\"branchCity\">" + mapProps.branches[i].city + "</div>";
            }
            if (mapDefaults.officeDetails.showCounty)
            {
                ret += "<div class=\"branchCounty\">" + mapProps.branches[i].county + "</div>";
            }
            if (mapDefaults.officeDetails.showCountry)
            {
                ret += "<div class=\"branchCountry\">" + mapProps.branches[i].country + "</div>";
            }
            if (mapDefaults.officeDetails.showPC)
            {
                ret += "<div class=\"branchPC\">" + mapProps.branches[i].postcode + "</div>";
            }
            if (mapDefaults.officeDetails.showTel1)
            {
                ret += "<div class=\"branchTel1\">" + mapProps.branches[i].tel1 + "</div>";
            }
            if (mapDefaults.officeDetails.showTel2)
            {
                ret += "<div class=\"branchTel2\">" + mapProps.branches[i].tel2 + "</div>";
            }
            if (mapDefaults.officeDetails.showFax1)
            {
                ret += "<div class=\"branchFax1\">" + mapProps.branches[i].fax1 + "</div>";
            }
            if (mapDefaults.officeDetails.showFax2)
            {
                ret += "<div class=\"branchFax2\">" + mapProps.branches[i].fax2 + "</div>";
            }
            if (mapDefaults.officeDetails.showEmail)
            {
                ret += "<div class=\"branchEmail\">" + mapProps.branches[i].email + "</div>";
            }
            if (mapDefaults.officeDetails.showURL)
            {
                ret += "<div class=\"branchURL\">" + mapProps.branches[i].url + "</div>";
            }
        ret += "</div>";
    return ret;
}

function showTotals() 
{
    if (mapDefaults.showTotals) 
    {
        var op = "Showing <b>" + countVisible() + "</b> of <b>" + (markers.length - mapProps.branches.length) + "</b> properties.";
        get("lblTotals").innerHTML = op;
    }
}

function showPropertyDetails(i)
{
    if (mapDefaults.useBalloonPop || mapDefaults.alternativeResultLocation == null || get(mapDefaults.alternativeResultLocation) == undefined || get(mapDefaults.alternativeResultLocation) == null)
    {
        return "<div id=\"baloon\">" + generateResult(i) + "</div>";
    }
    else
    {
        get(mapDefaults.alternativeResultLocation).innerHTML = generateResult(i);
    }
}

function propertyImage(foo, w, pstatus, puola, pRentalPeriod) {

    if (pRentalPeriod < 2) {

        if (puola == 'true') {
            return "<a href=\"Property.aspx?pid=" + foo.propertyId + "&eaid=" + foo.eaid + "\"><div class=\"status_small\">UNDER OFFER</div><img src=\"http://www.dezrez.com/estate-agent-software/ImageResizeHandler.do?PropertyID=" + foo.propertyId + "&PhotoID=1&AgentID=" + foo.eaid + "&BranchID=" + foo.bid + "&Width=" + w + "&Rotation=0&AWAITING=ON \" /></a> ";
        }
        else if (pstatus == 1) {
            return "<a href=\"Property.aspx?pid=" + foo.propertyId + "&eaid=" + foo.eaid + "\"><div class=\"status_small\">REDUCED</div><img src=\"http://www.dezrez.com/estate-agent-software/ImageResizeHandler.do?PropertyID=" + foo.propertyId + "&PhotoID=1&AgentID=" + foo.eaid + "&BranchID=" + foo.bid + "&Width=" + w + "&Rotation=0&AWAITING=ON \" /></a> ";
        }
        else if (pstatus == 2) {
            return "<a href=\"Property.aspx?pid=" + foo.propertyId + "&eaid=" + foo.eaid + "\"><div class=\"status_small\">SOLD STC</div><img src=\"http://www.dezrez.com/estate-agent-software/ImageResizeHandler.do?PropertyID=" + foo.propertyId + "&PhotoID=1&AgentID=" + foo.eaid + "&BranchID=" + foo.bid + "&Width=" + w + "&Rotation=0&AWAITING=ON \" /></a> ";
        }
        else {
            return "<a href=\"Property.aspx?pid=" + foo.propertyId + "&eaid=" + foo.eaid + "\"><img src=\"http://www.dezrez.com/estate-agent-software/ImageResizeHandler.do?PropertyID=" + foo.propertyId + "&PhotoID=1&AgentID=" + foo.eaid + "&BranchID=" + foo.bid + "&Width=" + w + "&Rotation=0&AWAITING=ON \" /></a> ";
        }

    }
    else {
        if (puola == 'true') {
            return "<a href=\"Property.aspx?pid=" + foo.propertyId + "&eaid=" + foo.eaid + "\"><div class=\"status_small\">LET AGREED</div><img src=\"http://www.dezrez.com/estate-agent-software/ImageResizeHandler.do?PropertyID=" + foo.propertyId + "&PhotoID=1&AgentID=" + foo.eaid + "&BranchID=" + foo.bid + "&Width=" + w + "&Rotation=0&AWAITING=ON \" /></a> ";
        }
        else if (pstatus == 1) {
            return "<a href=\"Property.aspx?pid=" + foo.propertyId + "&eaid=" + foo.eaid + "\"><div class=\"status_small\">REDUCED</div><img src=\"http://www.dezrez.com/estate-agent-software/ImageResizeHandler.do?PropertyID=" + foo.propertyId + "&PhotoID=1&AgentID=" + foo.eaid + "&BranchID=" + foo.bid + "&Width=" + w + "&Rotation=0&AWAITING=ON \" /></a> ";
        }
        else {
            return "<a href=\"Property.aspx?pid=" + foo.propertyId + "&eaid=" + foo.eaid + "\"><img src=\"http://www.dezrez.com/estate-agent-software/ImageResizeHandler.do?PropertyID=" + foo.propertyId + "&PhotoID=1&AgentID=" + foo.eaid + "&BranchID=" + foo.bid + "&Width=" + w + "&Rotation=0&AWAITING=ON \" /></a> ";
        }        
    }

}

function propertyLike(foo, w) {

    if (foo.portfolio == 'true') {
        return "<a target=\"_blank\" class=\"likeOn overlayLink\" href=\"http://www.dezrez.com/DRAPP/DotNetSites/WebEngine/Property/Portfolio.aspx?apikey=" + apikey + "&pid=" + foo.propertyId + "&eaid=" + foo.eaid + "&sessionGUID=" + sessionGUID + "&action=remove\">Don't like this property</a>";
    }
    else {
        return "<a target=\"_blank\" class=\"likeOff overlayLink\" href=\"http://www.dezrez.com/DRAPP/DotNetSites/WebEngine/Property/Portfolio.aspx?apikey=" + apikey + "&pid=" + foo.propertyId + "&eaid=" + foo.eaid + "&sessionGUID=" + sessionGUID + "&action=add\">Like this property</a>";
    }

}

function propertyLink(foo, w) {
    return "<a href=\"http://www.dezrez.com/DRApp/DotNetSites/WebEngine/property/Property.aspx?pid=" + foo.propertyId + "&eaid=" + foo.eaid + "&apikey=" + apikey + "\">More details</a> ";
}

function branchLogo(i, w)
{
    return "<img src=\"http://www.dezrez.com/DRApp/EstateAgents/" + mapProps.branches[i].eaid + "/Logo.gif \" width=\"" + w + "\" /> ";
}

function countVisible()
{
    var visible = 0;
    for (var i = 0; i < markers.length; i++)
    {
        if (markers[i].visible && markers[i].propertyId > 0)
        {
            visible++;
        }
    }
    return visible;
}

// ################################################################################################################################
// ################################################################################################################################
// ################################################################################################################################
// ################################################################################################################################

function trim(foo)
{
    //return foo.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, "");
}

function get(el)
{
    return document.getElementById(el);
}

var infowindow = new google.maps.InfoWindow();
var officeInfoWindow = new google.maps.InfoWindow();

function initialize()
{
    // Polygon getBounds extension - google-maps-extensions
    if (!google.maps.Polygon.prototype.getBounds)
    {
        google.maps.Polygon.prototype.getBounds = function (latLng)
        {
            var bounds = new google.maps.LatLngBounds();
            var paths = this.getPaths();
            var path;

            for (var p = 0; p < paths.getLength(); p++)
            {
                path = paths.getAt(p);
                for (var i = 0; i < path.getLength(); i++)
                {
                    bounds.extend(path.getAt(i));
                }
            }
            return bounds;
        }
    }

    // Polygon containsLatLng - method to determine if a latLng is within a polygon
    google.maps.Polygon.prototype.containsLatLng = function (latLng)
    {
        // Exclude points outside of bounds as there is no way they are in the poly
        var bounds = this.getBounds();

        if (bounds != null && !bounds.contains(latLng))
        {
            return false;
        }

        // Raycast point in polygon method
        var inPoly = false;

        var numPaths = this.getPaths().getLength();
        for (var p = 0; p < numPaths; p++)
        {
            var path = this.getPaths().getAt(p);
            var numPoints = path.getLength();
            var j = numPoints - 1;

            for (var i = 0; i < numPoints; i++)
            {
                var vertex1 = path.getAt(i);
                var vertex2 = path.getAt(j);

                if (vertex1.lng() < latLng.lng() && vertex2.lng() >= latLng.lng() || vertex2.lng() < latLng.lng() && vertex1.lng() >= latLng.lng())
                {
                    if (vertex1.lat() + (latLng.lng() - vertex1.lng()) / (vertex2.lng() - vertex1.lng()) * (vertex2.lat() - vertex1.lat()) < latLng.lat())
                    {
                        inPoly = !inPoly;
                    }
                }
                j = i;
            }
        }
        return inPoly;
    }

    var mapOptions = {
        center: new google.maps.LatLng(mapDefaults.lat, mapDefaults.lng),
        zoom: mapDefaults.zoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    //when the zoom level and centre has changed save the new values to the cookie
    google.maps.event.addListener(map, 'zoom_changed', saveMapState);
    google.maps.event.addListener(map, 'center_changed', saveMapState);

    function saveMapState() {
        var mapZoom = map.getZoom();
        var mapCentre = map.getCenter();
        var mapLat = mapCentre.lat();
        var mapLng = mapCentre.lng();
        var cookiestring = mapLat + "_" + mapLng + "_" + mapZoom;
        setCookie("myMapCookie", cookiestring, 30);
    }

    loadMapState();

    function loadMapState() {

        if (getCookie("myMapCookie") != null && getCookie("myMapCookie") != undefined) {
            var gotCookieString = getCookie("myMapCookie");
            var splitStr = gotCookieString.split("_");
            var savedMapLat = parseFloat(splitStr[0]);
            var savedMapLng = parseFloat(splitStr[1]);
            var savedMapZoom = parseFloat(splitStr[2]);
            if ((!isNaN(savedMapLat)) && (!isNaN(savedMapLng)) && (!isNaN(savedMapZoom))) {
                map.setCenter(new google.maps.LatLng(savedMapLat, savedMapLng));
                map.setZoom(savedMapZoom);
            }
        }

    }
    
    for (var i = 0; i < mapProps.properties.length; i++)
    {
        var m = new google.maps.Marker({
            map: map,
            icon: mapDefaults.propertyIcon,
            position: new google.maps.LatLng(mapProps.properties[i].position.lat, mapProps.properties[i].position.lng),
            visible: false,
            propertyId: mapProps.properties[i].propertyId,
            bid: mapProps.properties[i].bid,
            arrPos: i
        });
        google.maps.event.addListener(m, 'click', function ()
        {
            if (mapDefaults.useBalloonPop || mapDefaults.alternativeResultLocation == null || get(mapDefaults.alternativeResultLocation) == undefined || get(mapDefaults.alternativeResultLocation) == null)
            {
                infowindow.setContent(showPropertyDetails(this.arrPos));
                infowindow.open(map, this);
            }
            else
            {
                showPropertyDetails(this.arrPos);
            }
        });
        markers.push(m);
    }

    if (markers.length == 0) { noProperties(); }

    for (var j = 0; j < mapProps.branches.length; j++)
    {
        var b = new google.maps.Marker({
            map: map,
            icon: mapDefaults.branchIcon,
            position: new google.maps.LatLng(mapProps.branches[j].position.lat, mapProps.branches[j].position.lng),
            visible: true,
            bid: mapProps.branches[j].bid,
            propertyId: -1,
            arrPos: j
        });
        google.maps.event.addListener(b, 'click', function ()
        {
            if (mapDefaults.useOfficeBalloonPop)
            {
                officeInfoWindow.setContent(generateBranchDetails(this.arrPos));
                officeInfoWindow.open(map, this);
            }
        });
        markers.push(b);
    }

    drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: false,
        drawingControlOptions: {
            drawingModes: [google.maps.drawing.OverlayType.POLYGON]
        },
        polygonOptions: {
            editable: mapDefaults.editable,
            strokeColor: mapDefaults.strokeColor,
            fillColor: mapDefaults.fillColor,
            suppressUndo: true
        }
    });

    drawingManager.setMap(map);

    google.maps.event.addListener(drawingManager, 'polygoncomplete', function (p)
    {
        polygon = p;
        showHideProperties();
        updateNodeEvents();
        drawingManager.setDrawingMode(null);
    });
    showTotals();

    var coooookie = getCookie("poly")
    if (coooookie != null && coooookie != "")
    {
        var dzPoints = JSON.parse(coooookie);
        var gPoints = [];
        for (var i = 0; i < dzPoints.length; i++)
        {
            var g = new google.maps.LatLng(dzPoints[i].lat, dzPoints[i].lng);
            gPoints.push(g);
        }
        polygon = new google.maps.Polygon({ 
            path: gPoints, 
            editable: mapDefaults.editable,
            strokeColor: mapDefaults.strokeColor,
            fillColor: mapDefaults.fillColor,
            suppressUndo: true
        });
        drawingManager.setDrawingMode(null);
        polygon.setMap(map);
        showHideProperties();
        updateNodeEvents();
    }
}

function showHideProperties()
{
    for (var x = 0; x < markers.length; x++)
    {
        if (polygon.containsLatLng(markers[x].getPosition()))
        {
            markers[x].setVisible(true);
        }
        else
        {
            if (markers[x].propertyId > 0)
            {
                markers[x].setVisible(false);
            }
        }
    }
    showTotals();
    serializePoints();
}

function updateNodeEvents()
{
    var path = polygon.getPaths();
    for (var x = 0; x < path.length; x++)
    {
        google.maps.event.addListener(path.getAt(x), 'set_at', function ()
        {
            showHideProperties();
        });
        google.maps.event.addListener(path.getAt(x), 'insert_at', function ()
        {
            showHideProperties();
        });
    }
}

function serializePoints()
{
    var poly = polygon.getPath();
    var serializedPoly = [];
    for (var i = 0; i < poly.length; i++)
    {
        var xy = poly.getAt(i);
        var pt = { lat: xy.lat(), lng: xy.lng() };
        serializedPoly.push(pt);
    }
    setCookie("poly", JSON.stringify(serializedPoly), 1);
    
}

function getCookie(c_name)
{
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++)
    {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name)
        {
            return unescape(y);
        }
    }
}

function setCookie(c_name, value, exdays)
{
    if (exdays > 0)
    {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + exdays);
    }
    else
    {
        var exdate = new Date(0);
    }
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
}

function draw() {

    if (polygon == undefined)
    {        
        drawingManager.setDrawingMode('polygon');
    }
    else {
        clearMap();
        drawingManager.setDrawingMode('polygon');
    }
}

function centreMap() {
    if (confirm("Move back to the starting point?")) {
        var mapZoom = mapDefaults.zoom;
        var mapLat = mapDefaults.lat;
        var mapLng = mapDefaults.lng;
        var cookiestring = mapLat + "_" + mapLng + "_" + mapZoom;
        setCookie("myMapCookie", cookiestring, 30);

        document.location.reload();
    }
}

function clearMap() {

    if (confirm("This action will remove all existing search shapes from the map.")) {
        setCookie("poly", "", 0);
        polygon = [];

        var mapZoom = mapDefaults.zoom;
        var mapLat = mapDefaults.lat;
        var mapLng = mapDefaults.lng;
        var cookiestring = mapLat + "_" + mapLng + "_" + mapZoom;
        setCookie("myMapCookie", cookiestring, 30);

        document.location.reload();
    }

}

var coord = {
	_lat: "",
	_lng: "",
	get lat() {return this.lat},
	set lat(x) {this.lat = x},
	get lng() {return this.lng},
	set lng(x) {this.lng = x}	
}

var dezrezBranch = {
	_eaid: "",
	_bid: "",
	_position: "",	
	_name: "",
	_streetaddress1: "",
	_streetaddress2: "",
	_town: "",
	_city: "",
	_county: "",
	_postcode: "",
	_country: "",
	_tel1: "",
	_tel2: "",
	_fax1: "",
	_fax2: "",
	_email: "",
	_url: "",
	get eaid() {return this._eaid},
	set eaid(x) {this._eaid = x},
	get bid() {return this._bid},
	set bid(x) {this._bid = x},		
	get position() {return this._position},
	set position(coord) {this._position = coord},	
	get name() {return this._name},
	set name(x) {this._name = x},
	get streetaddress1() {return this._streetaddress1},
	set streetaddress1(x) {this._streetaddress1 = x},
	get streetaddress2() {return this._streetaddress2},
	set streetaddress2(x) {this._streetaddress2 = x},	
	get town() {return this._town},
	set town(x) {this._town = x},
	get city() {return this._city},
	set city(x) {this._city = x},	
	get county() {return this._county},
	set county(x) {this._county = x},	
	get postcode() {return this._postcode},
	set postcode(x) {this._postcode = x},	
	get country() {return this._country},
	set country(x) {this._country = x},	
	get tel1() {return this._tel1},
	set tel1(x) {this._tel1 = x},
	get tel2() {return this._tel2},
	set tel2(x) {this._tel2 = x},
	get fax1() {return this._fax1},
	set fax1(x) {this._fax1 = x},	
	get fax2() {return this._fax2},
	set fax2(x) {this._fax2 = x},	
	get email() {return this._email},
	set email(x) {this._email = x},	
	get url() {return this._url},
	set url(x) {this._url = x}	
}

var mapProperty = {
	_propertyId: "",
	_bid: "",
	_eaid: "",
	_position: "",
	_price: "",
	_rentalPeriod: "",
	_beds: "",
	_receps: "",
	_baths: "",
	_garages: "",
	_featured: "",
	_rescom: "",
	_useAddress: "",
	_num: "",
	_sa1: "",
	_sa2: "",
	_town: "",
	_city: "",
	_county: "",
	_country: "",
	_postcode: "",
	_summary: "",
	_portfolio: "",
	get propertyId() {return this._propertyId},
	set propertyId(x) {this._propertyId = x},
	get bid() {return this._bid},
	set bid(x) {this._bid = x},
	get eaid() {return this._eaid},
	set eaid(x) {this._eaid = x},
	get position() {return this._position},
	set position(coord) {this._position = coord},
	get price() {return this._price},
	set price(x) {this._price = x},
	get rentalPeriod() {return this._rentalPeriod},
	set rentalPeriod(x) {this._rentalPeriod = x},
	get beds() {return this._beds},
	set beds(x) {this._beds = x},
	get receps() {return this._receps},
	set receps(x) {this._receps = x},
	get baths() {return this._baths},
	set baths(x) {this._baths = x},
	get garages() {return this._garages},
	set garages(x) {this._garages = x},		
	get featured() {return this._featured},
	set featured(x) {this._featured = x},
	get rescom() {return this._rescom},
	set rescom(rescomnew) {this._rescom = rescomnew},
	get useAddress() {return this._useAddress},
	set useAddress(x) {this._useAddress = x},
	get num() {return this._num},
	set num(x) {this._num = x},
	get sa1() {return this._sa1},
	set sa1(x) {this._sa1 = x},
	get sa2() {return this._sa2},
	set sa2(x) {this._sa2 = x},
	get town() {return this._town},
	set town(x) {this._town = x},
	get city() {return this._city},
	set city(x) {this._city = x},
	get county() {return this._county},
	set county(x) {this._county = x},
	get country() {return this._country},
	set country(x) {this._country = x},
	get postcode() {return this._postcode},
	set postcode(x) {this._postcode = x},
	get summary() {return this._summary},
	set summary(x) {this._summary = x},
	get portfolio() {return this._portfolio},
	set portfolio(x) {this._portfolio = x}		
}

var payload = {
	_properties: "",
	_branches: "",
	get properties() {return this._properties},
	set properties(mapProperty) {this._properties = mapProperty;},	
	get branches() {return this._branches},
	set branches(dezrezBranch) {this._branches = dezrezBranch;}	
}

var rescomnew = {
	Residential: 1,
	NewBuild: 2,
	Commercial: 3,
	Land: 4,
	Foreign: 5,
	Other: 6,
	Investment: 7,
	Mooring: 8		
}

var searchParameters = {
	_apikey: "",
	_eaid: 0,
	_sessionGUID: "",		
	_branchList: "",		
	_minPrice: 0,
	_maxPrice: 0,
	_beds: 0,
	_showSTC_LetAgreed: "",
	_searchAllAddrFields: "",
	_searchSA1: "",
	_searchSA2: "",
	_searchTown: "",
	_searchCity: "",
	_searchCounty: "",
	_searchCountry: "",
	_searchPC: "",
	_searchLocationCodes: "",
	_classification: "",
	_propertyType: "",
	_oldPropertyType: "",
	_sortDescending: "",
	_perPage: 99999,
	_page: 1,
	_rentalPeriod: 0,
	get apikey() {return this._apikey},
	set apikey(x) {this._apikey = x;},	
	get eaid() {return this._eaid},
	set eaid(x) {this._eaid = x;},	
	get sessionGUID() {return this._sessionGUID},
	set sessionGUID(x) {this._sessionGUID = x;},	
	get branchList() {return this._branchList},
	set branchList(x) {this._branchList = x;},
	get minPrice() {return this._minPrice},
	set minPrice(x) {this._minPrice = x;},	
	get maxPrice() {return this._maxPrice},
	set maxPrice(x) {this._maxPrice = x;},	
	get beds() {return this._beds},
	set beds(x) {this._beds = x;},	
	get showSTC_LetAgreed() {return this._showSTC_LetAgreed},
	set showSTC_LetAgreed(x) {this._showSTC_LetAgreed = x;},
	get searchAllAddrFields() {return this._searchAllAddrFields},
	set searchAllAddrFields(x) {this._searchAllAddrFields = x;},	
	get searchSA1() {return this._searchSA1},
	set searchSA1(x) {this._searchSA1 = x;},
	get searchSA2() {return this._searchSA2},
	set searchSA2(x) {this._searchSA2 = x;},
	get searchTown() {return this._searchTown},
	set searchTown(x) {this._searchTown = x;},	
	get searchCity() {return this._searchCity},
	set searchCity(x) {this._searchCity = x;},	
	get searchCounty() {return this._searchCounty},
	set searchCounty(x) {this._searchCounty = x;},	
	get searchCountry() {return this._searchCountry},
	set searchCountry(x) {this._searchCountry = x;},	
	get searchPC() {return this._searchPC},
	set searchPC(x) {this._searchPC = x;},
	get searchLocationCodes() {return this._searchLocationCodes},
	set searchLocationCodes(x) {this._searchLocationCodes = x;},
	get classification() {return this._classification},
	set classification(x) {this._classification = x;},	
	get propertyType() {return this._propertyType},
	set propertyType(x) {this._propertyType = x;},		
	get oldPropertyType() {return this._oldPropertyType},
	set oldPropertyType(x) {this._oldPropertyType = x;},	
	get sortDescending() {return this._sortDescending},
	set sortDescending(x) {this._sortDescending = x;},	
	get perPage() {return this._perPage},
	set perPage(x) {this._perPage = x;},
	get page() {return this._page},
	set page(x) {this._page = x;},	
	get rentalPeriod() {return this._rentalPeriod},
	set rentalPeriod(x) {this._rentalPeriod = x;},
	isValid: function(){
		if (common.isGUID(_apikey) | _eaid > 0)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
}