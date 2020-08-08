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
    var apiUrl = " http://localhost:7071/api/gitcv/" + userName;

    const loader = function() {
        interval = setInterval(function() {
            if (loading) {
                $(".preloader-animation").css("opacity", 0.5);
            } else {
                $(".preloader-animation").css("opacity", 0.1);
            }
            loading = !loading;
        }, 200);
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
        $(".preloader").css("display", "none");
        clearInterval(interval);
    };

    const handleErrors = function(response) {
        hideAll();
    };

    function invoke(jsonResume) {

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
                verticalAlignMiddle: false,
            }
        ];
        jsonResume.volunteer = jsonResume.volunteer || [];
        jsonResume.publications = jsonResume.publications || [];
        if (jsonResume.volunteer.length > 0 || jsonResume.publications.length > 0) {
            sections.push({
                anchor: "Misc",
                templateId: "misc",
                backgroundColor: "transparent",
                sectionClass: "text-left",
                verticalAlignMiddle: true
            });
        }
        jsonResume.awards = jsonResume.awards || [];
        if (jsonResume.awards.length > 0) {
            sections.push({
                anchor: "Awards",
                templateId: "awards",
                backgroundColor: "transparent",
                sectionClass: "text-left",
                verticalAlignMiddle: true
            });
        }
        new SitePage("sitePage", {
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

        var getCompanyStartEndDate = function(item) {
            debugger
            var _this = this;
            console.log(this);
        };

        function GitResumeModel() {

            var self = this;
            self.isVol = ko.observable(false);
            self.isPub = ko.observable(false);
            self.isAwards = ko.observable(false);
            jsonResume.basics.picture = jsonResume.basics.picture || "https://s.gravatar.com/avatar/7e6be1e623fb85adde3462fa8587caf2?s=100&r=pg&d=mm";
            self.resume = ko.observable(jsonResume);
            jsonResume.basics.profiles = jsonResume.basics.profiles || [];
            jsonResume.skills = jsonResume.skills || [];
            self.profiles = ko.observableArray(jsonResume.basics.profiles);
            self.skills = ko.observableArray(jsonResume.skills);
            //#region  Contacts
            var getLocation = function() {
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
            }
            self.contacts = [];
            if (jsonResume.basics.location) {
                self.contacts.push({
                    "icon": "fa fa-map-marker title",
                    "text": getLocation()
                });
            }
            if (jsonResume.basics.phone) {
                self.contacts.push({
                    "icon": "fa fa-phone title",
                    "text": jsonResume.basics.phone
                });
            }
            if (jsonResume.basics.email) {
                self.contacts.push({
                    "icon": "fa fa-envelope title",
                    "text": jsonResume.basics.email
                });
            }
            if (jsonResume.basics.website) {
                self.contacts.push({
                    "icon": "fa fa-link title",
                    "text": jsonResume.basics.website
                });
            }

            jsonResume.languages = jsonResume.languages || [];
            if (jsonResume.languages.length > 0) {
                var languages = jsonResume.languages.map(function(item) {
                    return item.language;
                });
                self.contacts.push({
                    "icon": "fa fa-language title",
                    "text": languages.join(", ")
                });
            }


            //#endregion

            //#region Education
            jsonResume.education = jsonResume.education || [];
            self.education = ko.observableArray(jsonResume.education);
            //#endregion

            //#region Work
            jsonResume.work = jsonResume.work || [];
            jsonResume.work.forEach(function(work) {
                work.companyDate = `${work.startDate || ''} - ${work.endDate || ''}`;
                work.highlights = work.highlights || [];
            });
            self.work = ko.observableArray(jsonResume.work);
            //#endregion

            //#region Volunteer
            if (jsonResume.volunteer && jsonResume.volunteer.length > 0) {
                self.volunteers = ko.observable(jsonResume.volunteer);
                self.isVol = ko.observable(true);
            }
            //#endregion

            //#region Publication
            if (jsonResume.publications && jsonResume.publications.length > 0) {
                self.publications = ko.observable(jsonResume.publications);
                self.isPub = ko.observable(true);
            }
            //#endregion

            //#region Awards
            jsonResume.awards = jsonResume.awards || [];
            if (jsonResume.awards.length > 0) {
                self.isAwards = ko.observable(true);
                self.awards = ko.observable(jsonResume.awards);
            }
            //#endregion

            //#region  Interests
            jsonResume.interests = jsonResume.interests || []
            self.interests = ko.observable(jsonResume.interests);
            //#endregion
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