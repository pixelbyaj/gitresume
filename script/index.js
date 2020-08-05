const gitCV = function() {

    var loading = false;
    var interval;

    var GetUserName = function() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const username = urlParams.get('q')
        return username;
    }

    var userName = GetUserName();
    if (!userName) {
        userName = "pixelbyaj";
    }
    var apiUrl = "https://white-island-08116ee00.azurestaticapps.net/api/gitcv/" + userName;

    const loader = function() {
        interval = setInterval(function() {
            if (loading) {
                $(".preloader-animation").css("opacity", 0.8);
            } else {
                $(".preloader-animation").css("opacity", 0.1);
            }
            loading = !loading;
        }, 1001);
    };

    const hideAll = function() {
        $("#gitcv").hide();
        $(".copyrights").hide();
        $(".preloader").css("display", "none");
        clearInterval(interval);
    };

    const ready = function() {
        $("#gitcv").show();
        $(".copyrights").show();
    };

    const handleErrors = function(response) {
        hideAll();
    };

    function invoke(jsonResume) {

        var workSection = false;
        var sections = [{
                anchor: "About Me",
                templateId: "aboutme",
                backgroundColor: "transparent",
                sectionClass: "text-left",
                verticalAlignMiddle: true
            },
            {
                anchor: "Skills",
                templateId: "skills",
                backgroundColor: "transparent",
                sectionClass: "text-left",
                verticalAlignMiddle: true
            },
            {
                anchor: "Education",
                templateId: "education",
                backgroundColor: "transparent",
                sectionClass: "text-left",
                verticalAlignMiddle: true
            },
            {
                anchor: "Experience",
                templateId: "experience",
                backgroundColor: "transparent",
                sectionClass: "text-left",
                verticalAlignMiddle: true,
            }
        ];

        if (jsonResume.work.length > 3) {
            workSection = jsonResume.work.splice(3, jsonResume.work.length);
            sections.push({
                anchor: "Experience1",
                templateId: "experience1",
                backgroundColor: "transparent",
                sectionClass: "text-left",
                verticalAlignMiddle: true
            });
        }

        if (jsonResume.volunteer || jsonResume.publications) {
            sections.push({
                anchor: "Misc",
                templateId: "misc",
                backgroundColor: "transparent",
                sectionClass: "text-left",
                verticalAlignMiddle: true
            });
        }
        var sitePage = new SitePage("sitePage", {
            //brandname
            brandName: "",
            backgroundColor: "#444",
            verticalAlignMiddle: true, // By default it would be true	
            //sections
            sections: sections,
            //navigation
            anchors: false, //true|false
            navigation: 'vertical', //horizontal|vertical
            sameurl: true, //true|false
            hamburger: false, //{
            //lineColor: "#fff",
            //closeOnNavigation: false,
            //backgroundColor: ""
            //},
            //transition
            easing: "ease", //ease|ease-in|ease-out|ease-in-out|cubic-bezier(n,n,n,n)
            transitionSpeed: 1000, //speed in ms
            //scrolling
            autoScrolling: false, //true|false
            keyboardNavigation: true, //true|false
        });

        function GitResumeModel() {

            var self = this;
            self.isVol = ko.observable(false);
            self.isPub = ko.observable(false);
            self.resume = ko.observable(jsonResume);
            self.profiles = ko.observableArray(jsonResume.basics.profiles);
            self.skills = ko.observableArray(jsonResume.skills);
            self.getLocation = ko.computed(function() {
                var location = jsonResume.basics.location;
                var address = [];
                if (location.address) {
                    address.push(location.address);
                }
                if (location.city) {
                    address.push(location.city);
                }
                if (location.region) {
                    address.push(location.region);
                }
                if (location.postalCode) {
                    address.push(location.postalCode);
                }
                if (location.countryCode) {
                    address.push(location.countryCode);
                }
                return address.join(", ");
            });
            self.getLanguage = ko.computed(function() {
                var languages = jsonResume.languages.map(function(item) {
                    return item.language;
                });
                return languages.join(",");
            });
            self.education = ko.observable(jsonResume.education);

            self.work = ko.observable(jsonResume.work);
            if (workSection) {
                self.work1 = ko.observable(workSection);
            }
            if (jsonResume.volunteer.length > 0) {
                self.volunteers = ko.observable(jsonResume.volunteer);
                self.isVol = ko.observable(true);
            }
            if (jsonResume.publications.length > 0) {
                self.publications = ko.observable(jsonResume.publications);
                self.isPub = ko.observable(true);
            }
            self.awards = ko.observable(jsonResume.awards);
            self.interests = ko.observable(jsonResume.interests);
        }

        ko.applyBindings(new GitResumeModel());
    }

    const fetchJsonResume = function() {
        $.get(apiUrl)
            .done(function(response) {
                ready();
                invoke(response);
            })
            .fail(handleErrors);
    };

    return {
        init: function() {
            loader();
            fetchJsonResume();
        }
    }
}
new gitCV().init();