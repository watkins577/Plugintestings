var propertyApp = angular.module('propertyApp', ['ngSanitize']);
//var api = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2F1dGguZGV6cmV6LmNvbS9BcGlLZXlJc3N1ZXIiLCJhdWQiOiJodHRwczovL2FwaS5kZXpyZXouY29tL3NpbXBsZXdlYmdhdGV3YXkiLCJuYmYiOjE0NzMxNDkxMjQsImV4cCI6NDYyODgyMjcyNCwiSXNzdWVkVG9Hcm91cElkIjoiNzIyMDMiLCJBZ2VuY3lJZCI6IjMiLCJzY29wZSI6WyJpbXBlcnNvbmF0ZV93ZWJfdXNlciIsInByb3BlcnR5X2Jhc2ljX3JlYWQiXX0.u031ZyXnwtgFOqIG0jwyIZY8lLPKup7PA19qtBlXw6s";
var api = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2F1dGguZGV6cmV6LmNvbS9BcGlLZXlJc3N1ZXIiLCJhdWQiOiJodHRwczovL2FwaS5kZXpyZXouY29tL3NpbXBsZXdlYmdhdGV3YXkiLCJuYmYiOjE0NzMxNDkxMjQsImV4cCI6NDYyODgyMjcyNCwiSXNzdWVkVG9Hcm91cElkIjoiNzIyMDMiLCJBZ2VuY3lJZCI6IjMiLCJzY29wZSI6WyJpbXBlcnNvbmF0ZV93ZWJfdXNlciIsInByb3BlcnR5X2Jhc2ljX3JlYWQiXX0.u031ZyXnwtgFOqIG0jwyIZY8lLPKup7PA19qtBlXw6s";
propertyApp.filter('mapsembed', function($sce) {
	return function(latlon) {
		if (latlon) return $sce.trustAsResourceUrl("https://www.google.com/maps/embed/v1/view?key=AIzaSyBmATg7y5JLZAUtM0jfkobMTxGriTdq3go&center=" + latlon + "&zoom=15");
		return '';
	}
});
//Search results app use ngcontroller=searchresults to call.
propertyApp.controller('SearchResults', function($scope, $http, $filter, $timeout) {
	//Get params from Url 
	function getUrlParameter(sParam) {
		var sPageURL = window.location.search.substring(1);
		var sURLVariables = sPageURL.split('&');
		for (var i = 0; i < sURLVariables.length; i++) {
			var sParameterName = sURLVariables[i].split('=');
			if (sParameterName[0] == sParam) {
				return sParameterName[1];
			}
		}
	}
	//Setting search parameters as js variables to be called in api request        
	var MiniPrice = getUrlParameter('minPrice');
	var MaxiPrice = getUrlParameter('maxPrice');
	var MinBed = getUrlParameter('bedrooms');
	var page = getUrlParameter('page');
	var rent = getUrlParameter('rentalperiod');
	var type = getUrlParameter('propertytype');
	var arraytype = [];
	if (type == "0") { // Flats
		arraytype = ["Flat", "GroundFloorFlat"];
	} else if (type == "1") { // Houses
		arraytype = ["TerracedHouse", "EndTerraceHouse", "SemiDetachedHouse", "DetachedHouse"];
	} else if (type == "2") { // Commercial
		arraytype = ["Commercial Property", "CommercialLand"];
	} else if (type == "3") { // Plot
		arraytype = ["Plot"];
	} else if (type == "4") { // Apartment
		arraytype = ["Apartment", "Penthouse"];
	} else if (type == "5") { // Town House
		arraytype = ["TownHouse"];
	} else if (type == "6") { // Bungalow
		arraytype = ["TerracedBungalow", "SemiDetachedBungalow", "DetachedBungalow"];
	} else if (type == "8") { // Cottage
		arraytype = ["Cottage"];
	} else if (type == "9") { // Semi Detached
		arraytype = ["SemiDetachedHouse", "SemiDetachedBungalow", "SemiDetachedVilla"];
	} else if (type == "10") { // Detached
		arraytype = ["DetachedHouse", "DetachedBungalow", "DetachedVilla"];
	} else if (type == "11") { // Terraced
		arraytype = ["TerracedHouse", "TerracedBungalow", "EndTerraceHouse"];
	}
	var roletype = [];
	if (rent == '4') {
		roletype = ["Letting"];
	} else {
		roletype = ["Selling"];
	}
	//Setting request variables - API key, Headers and search queries.  
	var req = {
		url: 'https://api.dezrez.com/api/simplepropertyrole/search?APIKEY=' + api,
		method: 'POST',
		headers: {
			'Rezi-Api-Version': '1.0',
			'Content-Type': 'application/json'
		},
		data: {
			BranchIdList: [],
			MinimumPrice: MiniPrice,
			MaximumPrice: MaxiPrice,
			MinimumBedrooms: MinBed,
			PageNumber: page,
			Address: [],
			PageSize: 20,
			RoleTypes: roletype,
			MarketingFlags: ["ApprovedForMarketingWebsite"],
			PropertyTypes: arraytype,
			IncludeStc: true,
			//Test
		}
	}
	$http(req).success(function(data) {
		$scope.data = data;
		$scope.status = status;
		$scope.Property = data.Collection;
		$.each(data.Collection, function(i, prop) {
			
			$.each(prop.Descriptions, function() {
				if (this.SystemName == "SummaryText") {
					prop.summary = this.Text;
				}
			});
			
			prop.usePrice = $filter('currency')(prop.Price.PriceValue, '£', 0);
			if (prop.Price.PriceText) {
				prop.usePrice = prop.Price.PriceText + ' ' + prop.usePrice;
			}
			if (prop.Price.PriceType) {
				prop.usePrice = prop.usePrice + ' ' + prop.Price.PriceType.DisplayName;
			}
			if (prop.Flags.filter(function(v) {
					return v.SystemName == "PriceOnApplication"
				}).length > 0) {
				prop.usePrice = "P.O.A.";
			}
			$.each(prop.Flags, function(x, flag) {
				if (flag.SystemName == 'OfferAccepted') {
					prop.sold = true;
				}
			});
			if (prop.RoleType.SystemName == "Selling") {
				prop.useRole = "For Sale";
				if (prop.sold) {
					prop.useRole = "Sold STC";
				}
			} else if (prop.RoleType.SystemName == "Letting") {
				prop.useRole = "To Let";
				if (prop.sold) {
					prop.useRole = "Let Agreed";
				}
			}
			prop.Primary = prop.Images[0].Url;
			if (prop.Images[1]) prop.Secondary = prop.Images[1].Url;
			$.each(prop.Descriptions, function(k, desc) {
				if (desc.DescriptionType.SystemName == "StyleAge") {
					if (desc.LeaseType != null) prop.leasetype = desc.LeaseType.DisplayName;
				}
			});
		});
		//set page variable to use for simplepagination.
		page = data.TotalCount / data.PageSize;
		//Pagination call
		$('#pages').pagination({
			items: data.TotalCount,
			itemsOnPage: data.PageSize,
			cssStyle: 'light-theme'
		});
	});
});
propertyApp.controller('SearchResultsLatest', function($scope, $http) {
	//Setting request variables - API key, Headers and search queries.  
	var req = {
		url: 'https://api.dezrez.com/api/simplepropertyrole/search?APIKEY=' + api,
		method: 'POST',
		headers: {
			'Rezi-Api-Version': '1.0',
			'Content-Type': 'application/json'
		},
		data: {
			BranchIdList: [],
			MinimumPrice: 0,
			MaximumPrice: 9999999999,
			MinimumBedrooms: 0,
			PageNumber: 1,
			PageSize: 3,
			RoleTypes: [],
			MarketingFlags: ["ApprovedForMarketingWebsite"],
			PropertyTypes: [],
			SortBy: 2,
			SortOrder: 1,
			//Test
		}
	}
	$http(req).success(function(data) {
		$scope.data = data;
		$scope.status = status;
		$scope.Property = data.Collection;
		$.each(data.Collection, function(i, prop) {
			if (prop.RoleType.SystemName == "Selling") {
				prop.useRole = "For Sale";
			} else if (prop.RoleType.SystemName == "Letting") {
				prop.useRole = "To Let";
			}
			$.each(prop.Flags, function(x, flag) {
				if (flag.SystemName == 'PriceOnApplication') prop.POA = true;
			});
			$.each(prop.Images, function(j, image) {
				if (image.IsPrimaryImage) prop.primary = image.Url;
			});
			$.each(prop.Descriptions, function(k, desc) {
				if (desc.DescriptionType.SystemName == "StyleAge") {
					if (desc.LeaseType != null) prop.leasetype = desc.LeaseType.DisplayName;
				}
			});
		});
		//set page variable to use for simplepagination.
		page = data.TotalCount / data.PageSize;
		//Pagination call
	});
});
//Full details controller
propertyApp.controller('FullDetails', function($scope, $http, $timeout, $filter) {
	//Get params from Url 
	function getUrlParameter(sParam) {
		var sPageURL = window.location.search.substring(1);
		var sURLVariables = sPageURL.split('&');
		for (var i = 0; i < sURLVariables.length; i++) {
			var sParameterName = sURLVariables[i].split('=');
			if (sParameterName[0] == sParam) {
				return sParameterName[1];
			}
		}
	}
	//Set Property ID param
	var pid = getUrlParameter('pid');
	//Setting request variables - API key, Headers and RoleID.
	var req = {
		url: 'https://api.dezrez.com/api/simplepropertyrole/' + pid + '?APIKey=' + api,
		method: 'Get',
		headers: {
			'Rezi-Api-Version': '1.0',
			'Content-Type': 'application/json'
		},
	};
	//Setting scope variables to call here
	$scope.featuresArr = [];
	$scope.imagesArr = [];
	$scope.roomstitleArr = [];
	$scope.roomstextArr = [];
	$scope.epcArr = [];
	$scope.statusClass = "neutral";
	$http(req).success(function(data) {
		console.log(data);
		$scope.data = data;
		$scope.status = status;
		$scope.Property = data;
		$scope.prop = data;
		$scope.id = pid;
		$.each(data.ViewPoints, function() {
			$scope.latitude = this.Point.Latitude;
			$scope.longitude = this.Point.Longitude;
			$scope.pitch = this.Pitch;
			$scope.heading = this.Heading;
		});
		$scope.statusClass = 'neutral';
		if (data.RoleType.SystemName == "Selling") {
			$scope.useStatus = 'On Market';
			$scope.statusClass = 'neutral';
			if (data.Flags.filter(function(v) {
					return v.SystemName == "Reduced"
				}).length > 0) {
				$scope.useStatus = 'Reduced';
				$scope.statusClass = 'reduced';
			}
			if (data.Flags.filter(function(v) {
					return v.SystemName == "OfferAccepted"
				}).length > 0) {
				$scope.useStatus = 'Sold STC';
				$scope.statusClass = 'red';
			}
		} else if (data.RoleType.SystemName == "Letting") {
			$scope.useStatus = 'To Let';
			$scope.statusClass = 'neutral';
			if (data.Flags.filter(function(v) {
					return v.SystemName == "OfferAccepted"
				}).length > 0) {
				$scope.useStatus = 'Let Agreed';
				$scope.statusClass = 'red';
			}
		}
		$.each(data.Images, function(i) {
			$scope.imagesArr.push({
				image: this.Url,
				id: i
			});
			if (this.IsPrimaryImage) {
				$scope.primary = this.Url;
			}
		});
		$scope.usePrice = $filter('currency')(data.Price.PriceValue, '£', 0);
		if (data.Price.PriceText) {
			$scope.usePrice = data.Price.PriceText + ' ' + $scope.usePrice;
		}
		if (data.Price.PriceType) {
			$scope.usePrice = $scope.usePrice + ' ' + data.Price.PriceType.DisplayName;
		}
		if (data.Flags.filter(function(v) {
				return v.SystemName == "PriceOnApplication"
			}).length > 0) {
			$scope.usePrice = "P.O.A.";
		}

		function initMap() {
			
		}
		$timeout(initMap, 0, true);
		if (data.Address.Location != null) {
			$scope.latlon = data.Address.Location.Latitude + ',' + data.Address.Location.Longitude;
			console.log($scope.latlon);
		}
		//call to sort floorplans and epc apart.
		var floorplans = $scope.floorplans = [];
		$scope.useAddress = data.Address.Street + ', ' + data.Address.Locality + ', ' + data.Address.Town;
		$scope.useAddress = $scope.useAddress.replace(/ ,|^, /g, '');
		$scope.brochureArr = [];
		$.each(data.Documents, function() {
			if (this.DocumentSubType.SystemName == "Floorplan") {
				floorplans.push({
					image: this.Url
				});
			}
			if (this.DocumentSubType.SystemName == "EPC") {
				$scope.epc = this.Url;
			}
			if (this.DocumentSubType.SystemName == "Brochure") {
				$scope.brochureArr.push(this.Url);
			}
		});
		//call to sort descriptions to sepearate variables.
		$.each(data.Flags, function() {
			if (this.SystemName == 'PriceOnApplication') {
				$scope.prop.POA = true;
			}
		});
		$.each(data.Descriptions, function() {
			if (this.DescriptionType.SystemName == 'Feature') {
				$.each(this.Features, function(i, v) {
					$scope.featuresArr.push(v.Feature);
				});
			}
			if (this.DescriptionType.SystemName === "StyleAge") {
				$scope.Proptype = this.PropertyType.DisplayName;
				if (this.LeaseType != null) $scope.leasetype = this.LeaseType.DisplayName;
			}
			if (this.DescriptionType.SystemName == "RoomCount") {
				$scope.bed = this.Bedrooms;
				$scope.bath = this.Bathrooms;
				$scope.rec = this.Receptions;
			}
			if (this.DescriptionType.SystemName == "Amenity") {
				$scope.garden = this.Gardens;
				$scope.parking = this.ParkingSpaces;
				$scope.garage = this.Garages;
			}
			if (this.Name == "Main Marketing") {
				$scope.maintext = this.Text;
			}
			if (this.DescriptionType.SystemName === "SummaryText") {
				$scope.summary = this.Text;
			}
			if (this.DescriptionType.SystemName == "Room") {
				$.each(this.Rooms, function(i, v) {
					$scope.roomstitleArr.push(v);
				});
			}
		});
	});
});
//Featured properties controller
propertyApp.controller('FeaturedProp', function($scope, $http, $filter) {
	var req = {
		url: 'https://api.dezrez.com/api/simplepropertyrole/search?APIKey=' + api,
		method: 'POST',
		headers: {
			'Rezi-Api-Version': '1.0',
			'Content-Type': 'application/json'
		},
		data: {
			MinimumPrice: "",
			MaximumPrice: "",
			MinimumBedrooms: 0,
			MaximumBedrooms: "",
			BranchIdList: [],
			PageSize: 4,
			MarketingFlags: ["Featured", "ApprovedForMarketingWebsite"]
		}
	};
	$http(req).success(function(data) {
		$scope.data = data;
		$scope.status = status;
		$scope.Property = data.Collection;
		console.log(data);
		$.each(data.Collection, function(i, prop) {
			prop.Primary = prop.Images[0].Url;
			$.each(prop.Images, function(j, image) {
				if (image.IsPrimaryImage) prop.Primary = image.Url;
			});
			prop.useAddress = prop.Address.Street + ', ' + prop.Address.Locality + ', ' + prop.Address.Town;
			prop.useAddress = prop.useAddress.replace(/ ,|^, /g, '');
			prop.usePrice = $filter('currency')(prop.Price.PriceValue, '£', 0);
			if (prop.Price.PriceText) {
				prop.usePrice = prop.Price.PriceText + ' ' + prop.usePrice;
			}
			if (prop.Price.PriceType) {
				prop.usePrice = prop.usePrice + ' ' + prop.Price.PriceType.DisplayName;
			}
			if (prop.Flags.filter(function(v) {
					return v.SystemName == "PriceOnApplication"
				}).length > 0) {
				prop.usePrice = "P.O.A.";
			}
		});
	});
});
propertyApp.controller('Latestprop-Sales', function($scope, $http) {
	var req = {
		url: 'https://api.dezrez.com/api/simplepropertyrole/search?APIKey=' + api,
		method: 'POST',
		headers: {
			'Rezi-Api-Version': '1.0',
			'Content-Type': 'application/json'
		},
		data: {
			MinimumPrice: "",
			MaximumPrice: "",
			MinimumBedrooms: "",
			MaximumBedrooms: "",
			BranchIdList: [],
			RoleTypes: [],
			MarketingFlags: ["ApprovedForMarketingWebsite"],
			PageSize: 4,
			SortBy: 2,
			SortOrder: 1,
		}
	}
	$http(req).success(function(data) {
		$scope.data = data;
		$scope.status = status;
		$scope.Property = data.Collection;
		console.log($scope.Property);
	});
});
propertyApp.controller('Latestprop-Lettings', function($scope, $http) {
	var req = {
		url: 'https://api.dezrez.com/api/simplepropertyrole/search?APIKey=' + api,
		method: 'POST',
		headers: {
			'Rezi-Api-Version': '1.0',
			'Content-Type': 'application/json'
		},
		data: {
			MinimumPrice: "",
			MaximumPrice: "",
			MinimumBedrooms: "",
			MaximumBedrooms: "",
			BranchIdList: [],
			RoleTypes: ["letting"],
			MarketingFlags: ["ApprovedForMarketingWebsite"],
			PageSize: 4,
			SortBy: 2,
			SortOrder: 1,
		}
	}
	$http(req).success(function(data) {
		$scope.data = data;
		$scope.status = status;
		$scope.Property = data.Collection;
		console.log($scope.Property);
	});
});