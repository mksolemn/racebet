$(document).ready(function () {

    var widgetModule = {};

    widgetModule = {
        filterElement: '.filters', // element that contains checkbox filters
        raceElement: '#odds', // template for handlebars
        handlebarsPlaceholder: '.handlebars-placeholder', // placeholder for handlebars template
        filteredArray: [], //array of filters build from selected checkboxes
        filteredData: [],

        // creating filter from selected checkboxes
        checkboxFilter: function () {
            var self = this;

            // Filter on page load
            $(this.filterElement).find('input').each(function () {
                if ($(this).is(':checked')) {
                    self.filteredArray.push($(this).parent().attr('class'));
                }
            });

            // Filters on checkbox click
            $(this.filterElement).on('change', 'input', function () {
                self.filteredData = [];
                if (self.filteredArray.includes($(this).parent().attr('class'))) {
                    var index = self.filteredArray.indexOf($(this).parent().attr('class'));
                    if (index > -1) {
                        self.filteredArray.splice(index, 1);
                    }
                } else {
                    self.filteredArray.push($(this).parent().attr('class'));
                }
                self.fetchData(self.filteredArray);

            });
        },
        
        // Retrieve json data
        fetchData: function (filters) {
            var self = this;
            $.ajax({
                type: 'GET',
                url: '../data/next_races.json',
                dataType: 'JSON',
                success: function (result) {

                    //call first filter function
                    self.dataObject = result.data;
                    self.findMatches();
                    
                }
            });
        },
        
        // create array of matching values
        findMatches: function () {
            
            var self = this;
            
            for ( var i = 0; self.dataObject.races.length > i; i += 1 ) {
                var raceType = self.dataObject.races[i].race_type;
                for (var x = 0; self.filteredArray.length > x; x += 1) {
                    if( raceType == self.filteredArray[x]) {
                        self.filteredData.push(self.dataObject.races[i]);
                    } 
                }
            }
            
            // to test this filter comment findBiggest init and uncomment handlebars init
            // chain filter to find object with highest purse value
            this.findBiggest();
            //this.handlebarsInit();
        },
        
        // find and filter biggest purse
        findBiggest: function () {
            
            var highest = 0;
            

            var highestIndex;

            // find highest value in array
            for ( var index = 0; this.filteredData.length > index; index += 1) {
   
                     switch(this.filteredData[index].purse.currency) {
                        case "GBP":
                            multiply = 1.2;
                            break;
                        case "EUR":
                            multiply = 1;
                            break;
                    }

                if(this.filteredData[index].purse.amount >= highest){
                        
                    highest = this.filteredData[index].purse.amount*multiply;
                    highestIndex = index;
                
                }   
            }
            
            // push object with highest value to array
            if(this.filteredData[highestIndex] != null){
                this.filteredData.push(this.filteredData[highestIndex]);
            }
            
            // remove all previous objects
            this.filteredData.splice(0, this.filteredData.length -1);
            
            this.handlebarsInit();
            
        },
        // Pass retrieved data to handlebars
        handlebarsInit: function (data) {
            $(this.handlebarsPlaceholder).empty();
            var theData = this.filteredData;
            var theTemplateScript = $(this.raceElement).html();
            var theTemplate = Handlebars.compile(theTemplateScript);
            $(this.handlebarsPlaceholder).append(theTemplate(theData));
            
        }
       
    };

    // Function init
    widgetModule.fetchData();
    widgetModule.checkboxFilter();

    // handlebars helper for date
    Handlebars.registerHelper('convertTime', function(options) {
        var futureTime = options.fn(this)*1000;
        var currentTime = new Date().getTime();
        var leftTime = futureTime - currentTime;
        return parseInt(leftTime/60);
      });

});
