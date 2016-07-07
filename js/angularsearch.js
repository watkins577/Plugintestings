var propertyApp = angular.module('propertyApp', ['ngSanitize']);

var api = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2F1dGguZGV6cmV6LmNvbS9BcGlLZXlJc3N1ZXIiLCJhdWQiOiJodHRwczovL2FwaS5kZXpyZXouY29tL3NpbXBsZXdlYmdhdGV3YXkiLCJuYmYiOjE0NDM0NDg4MDEsImV4cCI6NDU5OTEyMjQwMSwiSXNzdWVkVG9Hcm91cElkIjoiMjAxOTEiLCJBZ2VuY3lJZCI6IjciLCJzY29wZSI6WyJpbXBlcnNvbmF0ZV93ZWJfdXNlciIsInByb3BlcnR5X2Jhc2ljX3JlYWQiXX0.m6r4bOlFiJfPQGWj53V2gZCGDb2NjrpEm1T-laPTWPI";

	propertyApp.controller('SearchResults',function ($scope, $http){
		
		function getUrlParameter(sParam)
		{
			var sPageURL = window.location.search.substring(1);
			var sURLVariables = sPageURL.split('&');
		for (var i = 0; i < sURLVariables.length; i++) 
			{
				var sParameterName = sURLVariables[i].split('=');
				if (sParameterName[0] == sParam) 
				{
					return sParameterName[1];
				}
			}
		}
		 
		var MiniPrice = getUrlParameter('MinimumPrice');
		var MaxiPrice = getUrlParameter('maxprice');
		var MinBed = getUrlParameter('bedrooms');
		var page = getUrlParameter('page');
		var add = getUrlParameter('address');
		var order = getUrlParameter('order');
		var rent = getUrlParameter('roletype');
		
		if (rent == "letting"){
			salerent = "Letting" 
		}
		else {
			salerent = "Selling"
		}
		
		var req = {
		url: 'https://api.dezrez.com/api/simplepropertyrole/search?APIKEY=' + api,
		method: 'POST',
		headers: {
			'Rezi-Api-Version' : '1.0',
			'Content-Type' : 'application/json'
			},
		data: {
			BranchIdList:[],
			MinimumPrice:MiniPrice,
			MaximumPrice:MaxiPrice,
			IncludeStc:true,
			MinimumBedrooms:MinBed,
			PageNumber:page,
			SortOrder:1,
			PageSize:12,
			MarketingFlags: ["ApprovedForMarketingWebsite"],
			RoleTypes:[salerent],
			Address:add
			  }
		};
		
		$http(req).success(function(data){
			if (!String.prototype.contains) {
				
			String.prototype.contains = function(s) {
				return this.indexOf(s) > -1
			}
		
		}
		
		var i = "";
		var page = "";
		$scope.data = data;
		$scope.status = status;
		$scope.Property =  data.Collection;	
		page = data.TotalCount / data.PageSize;
		
			$('#pages').pagination({
				items: data.TotalCount,
				itemsOnPage: data.PageSize,
				cssStyle: 'light-theme'
			});
			
			$('#pagess').pagination({
				items: data.TotalCount,
				itemsOnPage: data.PageSize,
				cssStyle: 'light-theme'
			});					
		
		}); 
		
		});
		propertyApp.controller('FullDetails',function ($scope, $http){
			
			function getUrlParameter(sParam)
			{
			var sPageURL = window.location.search.substring(1);
			var sURLVariables = sPageURL.split('&');
			for (var i = 0; i < sURLVariables.length; i++) 
				{
				var sParameterName = sURLVariables[i].split('=');
					if (sParameterName[0] == sParam) 
						{
							return sParameterName[1];
						}
				}
			} 
		
		var pid = getUrlParameter('pid');
		var req = {
		url: 'https://api.dezrez.com/api/simplepropertyrole/'+pid+'?APIKEY=' + api,
		method: 'Get',
		headers:
			{
			'Rezi-Api-Version' : '1.0',
			'Content-Type' : 'application/json'
			},
		};
		$scope.featuresArr=[];
		$scope.imagesArr=[];
		$scope.roomstitleArr=[];
		$scope.roomstextArr=[];
		$scope.brochuresArr=[];
		$http(req).success(function(data){
		$scope.data = data;
		$scope.status = status;
		$scope.Property =  data;
		$scope.id = pid;
		$scope.order = "0";
		$scope.EPC = "";
		$scope.Floorplan = "";
		//console.log($scope.Property);
		var i = "";
		
			if (!String.prototype.contains)
			{
				String.prototype.contains = function(s)
				{
				return this.indexOf(s) > -1
				}
			}  
			
		$scope.Proptype = data.PropertyType.DisplayName;

		
		$.each(data.Images, function()
		{
			if(this.IsPrimaryImage === true){
				console.log(this.Url)
				$scope.Primary = this.Url;
			}
			else{
			$scope.imagesArr.push(this);
			$scope.order ++;
			i++
			}
		});
		
		$.each(data.Documents,function()
		{
			if(this.DocumentSubType.SystemName === "Floorplan")
			{
				$scope.Floorplan = this.Url;
			}
			if(this.DocumentSubType.SystemName === "EPC")
			{
				$scope.EPC = this.Url;
				console.log($scope.EPC);
			}
			if(this.DocumentSubType.SystemName === "Brochure")
			{
				$scope.brochuresArr.push(this.Url); 
			}
		});
		
		$.each(data.Descriptions,function(){
		if (this.Name === "Summary")
		{
			$scope.desc1summary = this.Text;
		}
				
		if (this.Name === "Main Marketing")
		{
			$scope.desc1 = this.Text;
		}
		
		if(this.Name === "Directions")
		{
			$scope.directions = this.Text;	
		}
		
		if(this.Name === "Location")
		{
			$scope.location = this.Text;	
		}
				
		if (this.DescriptionType.SystemName == 'Feature')
		{
			$.each(this.Features, function (i,v)
			{
				$scope.featuresArr.push(v.Feature);
			});
		}
		
		if(this.DescriptionType.SystemName == "RoomCount")
		{
			$scope.bed = this.Bedrooms;
			$scope.bath = this.Bathrooms;
			$scope.rec = this.Receptions;
		}
		
		if(this.DescriptionType.SystemName == "Room")
		{
			$.each(this.Rooms, function (i,v)
			{
				if(this.RoomDescriptionType.SystemName == "Room")
			{
				$scope.roomstitleArr.push(v);
			}
			});
		}
		
		});
		
		});
		
		});
		
		
		propertyApp.controller('Featured',function ($scope, $http){
		var req = {
		url:'https://api.dezrez.com/api/simplepropertyrole/search?APIKEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2F1dGguZGV6cmV6LmNvbS9BcGlLZXlJc3N1ZXIiLCJhdWQiOiJodHRwczovL2FwaS5kZXpyZXouY29tL3NpbXBsZXdlYmdhdGV3YXkiLCJuYmYiOjE0NDM0NDg4MDEsImV4cCI6NDU5OTEyMjQwMSwiSXNzdWVkVG9Hcm91cElkIjoiMjAxOTEiLCJBZ2VuY3lJZCI6IjciLCJzY29wZSI6WyJpbXBlcnNvbmF0ZV93ZWJfdXNlciIsInByb3BlcnR5X2Jhc2ljX3JlYWQiXX0.m6r4bOlFiJfPQGWj53V2gZCGDb2NjrpEm1T-laPTWPI',
		method: 'POST',
		headers: {
		'Rezi-Api-Version' : '1.0',
		'Content-Type' : 'application/json'
		},
		data: { BranchIdList:[],MinimumPrice:"",MaximumPrice:"99999999",MinimumBedrooms:"",PageSize:2,MarketingFlags: ["Featured", "ApprovedForMarketingWebsite"] }
		};
		$http(req).success(function(data){
		$scope.data = data;
		$scope.status = status;
		$scope.Property =  data.Collection;
		if (!String.prototype.contains) {
		String.prototype.contains = function(s) {
		return this.indexOf(s) > -1
		}
		}
		$.each(data.Collection, function(){
		console.log(this);
		$.each(this.Images, function(){
		if(this.Url.contains("dezrezcorelive")){
		this.Url = this.Url + '?';  
		}
		else{
		this.Url = this.Url + '&';  
		}
		
		});
		
		});
		
		}); 
		
		});
		propertyApp.controller('FeaturedLet',function ($scope, $http){
		var req = {
		url:'https://api.dezrez.com/api/simplepropertyrole/search?APIKEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2F1dGguZGV6cmV6LmNvbS9BcGlLZXlJc3N1ZXIiLCJhdWQiOiJodHRwczovL2FwaS5kZXpyZXouY29tL3NpbXBsZXdlYmdhdGV3YXkiLCJuYmYiOjE0NDM0NDg4MDEsImV4cCI6NDU5OTEyMjQwMSwiSXNzdWVkVG9Hcm91cElkIjoiMjAxOTEiLCJBZ2VuY3lJZCI6IjciLCJzY29wZSI6WyJpbXBlcnNvbmF0ZV93ZWJfdXNlciIsInByb3BlcnR5X2Jhc2ljX3JlYWQiXX0.m6r4bOlFiJfPQGWj53V2gZCGDb2NjrpEm1T-laPTWPI',
		method: 'POST',
		headers: {
		'Rezi-Api-Version' : '1.0',
		'Content-Type' : 'application/json'
		},
		
		data: { BranchIdList:[],MinimumPrice:"",MaximumPrice:"99999999",MinimumBedrooms:"",PageSize:2,MarketingFlags: ["Featured", "ApprovedForMarketingWebsite"],RoleTypes:["Lettings"] }
		};
		
		$http(req).success(function(data){
		$scope.data = data;
		$scope.status = status;
		$scope.Property =  data.Collection;
		if (!String.prototype.contains) {
		String.prototype.contains = function(s) {
		return this.indexOf(s) > -1
		}
		}
		$.each(data.Collection, function(){
		console.log(this);
		$.each(this.Images, function(){
		if(this.Url.contains("dezrezcorelive")){
		this.Url = this.Url + '?';  
		}
		else{
		this.Url = this.Url + '&';  
		}
		});
		});
		}); 
		
		});
		propertyApp.controller('Latest',function ($scope, $http){
		var req = {
		url: 'https://api.dezrez.com/api/simplepropertyrole/search?APIKEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2F1dGguZGV6cmV6LmNvbS9BcGlLZXlJc3N1ZXIiLCJhdWQiOiJodHRwczovL2FwaS5kZXpyZXouY29tL3NpbXBsZXdlYmdhdGV3YXkiLCJuYmYiOjE0NDM0NDg4MDEsImV4cCI6NDU5OTEyMjQwMSwiSXNzdWVkVG9Hcm91cElkIjoiMjAxOTEiLCJBZ2VuY3lJZCI6IjciLCJzY29wZSI6WyJpbXBlcnNvbmF0ZV93ZWJfdXNlciIsInByb3BlcnR5X2Jhc2ljX3JlYWQiXX0.m6r4bOlFiJfPQGWj53V2gZCGDb2NjrpEm1T-laPTWPI',
		method: 'POST',
		headers: {
		'Rezi-Api-Version' : '1.0',
		'Content-Type' : 'application/json'
		},
		data: { BranchIdList:[],MinimumPrice:[],MaximumPrice:[],MinimumBedrooms:[],PageSize:8,MaximumTimeOnMarket:14, MarketingFlags: ["ApprovedForMarketingWebsite"] }
		};
		$http(req).success(function(data){
		var i = "";
		var page = "";
		$scope.data = data;
		$scope.status = status;
		$scope.Property =  data.Collection;
		if (!String.prototype.contains) {
		String.prototype.contains = function(s) {
		return this.indexOf(s) > -1
		}
		}
		$.each(data.Collection, function(){
		$.each(this.Images, function(){
		if(this.Url.contains("dezrezcorelive")){
		this.Url = this.Url + '?';  
		}
		else{
		this.Url = this.Url + '&';  
		}
		});
		});
	}); 
});
