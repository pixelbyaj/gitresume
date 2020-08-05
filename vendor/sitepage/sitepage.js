/*!
 * sitePage.js - v3.0.0
 * https://github.com/pixelbyaj/SitePage
 * @author Abhishek Joshi
 * @license MIT
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var SitePage = (function () {
    function SitePage(id, options) {
        var _this = this;
        this.api = {
            gotoPage: function (pageId) {
            },
            navigateToNextPage: function () {
            },
            navigateToPrevPage: function () {
            },
            getMenuItems: function () {
                return null;
            },
            getActivePage: function () {
                return null;
            }
        };
        var scrollWay = "vertical";
        var _scrollings = [];
        var _lastScrollCount = 0;
        var _sectionIds = [];
        var _activePageIndex;
        var _activeSection;
        var pageIndex = 0;
        var canScroll = true;
        var scrollerTime;
        if (!id) {
            throw "Page element not found";
        }
        var $ = document;
        var $e = $.getElementById(id);
        if (!$e) {
            throw "Page element not found";
        }
        var DEFAULT = {
            BACKGROUNDCOLOR: "#fc6c7c",
            MENUID: "sp-menu",
            NAVIGATION: "vertical",
            EASING: "ease",
            SAMEURL: true,
            AUTOSCROLLING: true,
            ANCHORS: true,
            VERTICALALIGNMIDDLE: true,
            KEYBOARDNAVIGATION: true,
            SCROLLBAR: false,
            TRANSITIONSPEED: 1000,
            HAMBURGER: true,
            HaMBURGERLINECOLOR: '#ffffff',
        };
        var _options = {
            brandName: "",
            brandLogoUrl: "",
            backgroundColor: DEFAULT.BACKGROUNDCOLOR,
            anchors: DEFAULT.ANCHORS,
            menuId: DEFAULT.MENUID,
            verticalAlignMiddle: DEFAULT.VERTICALALIGNMIDDLE,
            sections: [],
            navigation: DEFAULT.NAVIGATION,
            hamburger: DEFAULT.HAMBURGER,
            autoScrolling: DEFAULT.AUTOSCROLLING,
            keyboardNavigation: DEFAULT.KEYBOARDNAVIGATION,
            scrollbar: DEFAULT.SCROLLBAR,
            transitionSpeed: DEFAULT.TRANSITIONSPEED,
            easing: DEFAULT.EASING,
            sameurl: DEFAULT.SAMEURL,
            pageTransitionStart: function (prevPage, currentPage) { },
            pageTransitionEnd: function (currentPage) { },
        };
        if (options) {
            _options = __assign(__assign({}, _options), options);
        }
        var htmlUtility = {
            setInitialStyle: function () {
                $e.style.transform = "translate3d(0px, 0px, 0px)";
                $e.classList.add("sp-wrapper");
                $.querySelector("body").style.backgroundColor = _options.backgroundColor;
            },
            setSectionClass: function (element) {
                element.classList.add("sp-section");
            },
            setSectionHeight: function (element) {
                element.style.height = window.innerHeight + "px";
            },
            setSectionHorizontal: function (element) {
                element.style.width = (_sectionIds.length * 100) + "%";
                element.classList.add("sp-floatLeft");
                element.querySelectorAll(".section").forEach(function (e) {
                    e.classList.add("sp-floatLeft");
                    e.style.width = (100 / _sectionIds.length) + "%";
                });
            },
            getCellElement: function (classList, verticalAlignMiddle) {
                var _a;
                var cellDiv = $.createElement("div");
                cellDiv.setAttribute("class", "sp-cell");
                if (_options.verticalAlignMiddle) {
                    if (verticalAlignMiddle === undefined || verticalAlignMiddle)
                        classList.push.apply(classList, ["align-middle", "text-center"]);
                }
                if (classList) {
                    (_a = cellDiv.classList).add.apply(_a, classList);
                }
                htmlUtility.setSectionHeight(cellDiv);
                return cellDiv;
            },
            setBackgroundColor: function (element, color) {
                element.style.backgroundColor = color;
            },
            setBrandName: function (classList, brandName, brandLogoUrl) {
                var _a;
                var navSpan = $.createElement("span");
                (_a = navSpan.classList).add.apply(_a, classList);
                var brandNode;
                if (brandName) {
                    brandNode = $.createTextNode(brandName);
                    navSpan.appendChild(brandNode);
                }
                else {
                    brandNode = $.createElement("img");
                    brandNode.setAttribute("src", brandLogoUrl);
                    navSpan.appendChild(brandNode);
                }
                return navSpan;
            },
            setNavigationLink: function (classList, anchor, anchorId) {
                var _a;
                var navLi = $.createElement("li");
                navLi.classList.add("nav-item");
                var navA = $.createElement("a");
                (_a = navA.classList).add.apply(_a, classList);
                navA.removeEventListener("click", eventListners.navigationClick);
                navA.setAttribute("href", "javascript:void(0)");
                navA.setAttribute("data-href", anchorId);
                navA.addEventListener("click", eventListners.navigationClick);
                var textNode = $.createTextNode(anchor);
                navA.appendChild(textNode);
                navLi.appendChild(navA);
                return navLi;
            },
            setHamburgerMenu: function () {
                var _a, _b, _c;
                var menuBar = $.createElement("div");
                menuBar.setAttribute("id", _options.menuId);
                menuBar.classList.add("sp-hb-menu-bar");
                var menu = $.createElement("div");
                menu.classList.add("sp-hb-menu");
                for (var i = 1; i <= 3; i++) {
                    var barLine = $.createElement("div");
                    barLine.setAttribute("id", "bar" + i);
                    barLine.classList.add("bar");
                    if (_options.hamburger) {
                        if (_options.hamburger.lineColor) {
                            barLine.style.backgroundColor = _options.hamburger.lineColor;
                        }
                        else {
                            barLine.style.backgroundColor = DEFAULT.HaMBURGERLINECOLOR;
                        }
                    }
                    else {
                        barLine.classList.add("bar-color");
                    }
                    menu.appendChild(barLine);
                }
                menuBar.appendChild(menu);
                var ulNav = $.createElement("ul");
                ulNav.classList.add("sp-hb-nav");
                menuBar.appendChild(ulNav);
                var bgDiv = $.createElement("div");
                bgDiv.setAttribute("id", "sp-hb-menu-bg");
                bgDiv.classList.add("sp-hb-menu-bg");
                bgDiv.style.height = window.innerHeight + "px";
                if (_options.hamburger.backgroundColor) {
                    bgDiv.style.backgroundColor = _options.hamburger.backgroundColor;
                }
                menuBar.appendChild(bgDiv);
                if (((_a = _options.brandName) === null || _a === void 0 ? void 0 : _a.length) > 0 || ((_b = _options.brandLogoUrl) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                    var brandName = htmlUtility.setBrandName(['sp-hb-navbar-brand'], _options.brandName, _options.brandLogoUrl);
                    menuBar.appendChild(brandName);
                }
                (_c = $.querySelector("body")) === null || _c === void 0 ? void 0 : _c.insertBefore(menuBar, $.querySelector("#" + id));
                menu.addEventListener("click", eventListners.onHamburgerMenuClick);
                return ulNav;
            },
            setNavigationMenu: function () {
                var _a, _b;
                var _c, _d, _e;
                var nav = $.createElement("nav");
                var navClass = ["navbar", "fixed-top", "navbar-expand", "navbar-dark", "flex-column", "flex-md-row", "bd-navbar"];
                (_a = nav.classList).add.apply(_a, navClass);
                if (((_c = _options.brandName) === null || _c === void 0 ? void 0 : _c.length) > 0 || ((_d = _options.brandLogoUrl) === null || _d === void 0 ? void 0 : _d.length) > 0) {
                    var navBrand = htmlUtility.setBrandName(["navbar-brand", "mb-0", "h1"], _options.brandName, _options.brandLogoUrl);
                    nav.appendChild(navBrand);
                }
                var navDiv = $.createElement("div");
                navDiv.setAttribute("id", "navbarNav");
                navDiv.classList.add("navbar-nav-scroll");
                var navUl = $.createElement("ul");
                navUl.setAttribute("id", _options.menuId);
                var navUlClass = ["navbar-nav", "bd-navbar-nav", "flex-row"];
                (_b = navUl.classList).add.apply(_b, navUlClass);
                navDiv.appendChild(navUl);
                nav.appendChild(navDiv);
                (_e = $.querySelector("body")) === null || _e === void 0 ? void 0 : _e.insertBefore(nav, $.querySelector("#" + id));
                return navUl;
            },
            setSection: function (section, index) {
                var sectionDiv = $.createElement("div");
                sectionDiv.setAttribute("id", "section-" + index);
                sectionDiv.classList.add("section");
                if (section.active) {
                    sectionDiv.classList.add("active");
                }
                if (section.templateUrl) {
                    var response = "<sp-include url=\"" + section.templateUrl + "\"/>";
                    sectionDiv.innerHTML = response;
                }
                else if (section.templateId) {
                    var template = document.getElementById(section.templateId);
                    sectionDiv.innerHTML = template.innerHTML;
                }
                else if (section.template) {
                    sectionDiv.innerHTML = section.template;
                }
                htmlUtility.setSectionClass(sectionDiv);
                htmlUtility.setSectionHeight(sectionDiv);
                return sectionDiv;
            },
            fetchView: function () {
                var spInclude = _activeSection.querySelector("sp-include");
                if (spInclude) {
                    var url = spInclude.getAttribute("url");
                    fetch(url)
                        .then(function (response) {
                        return response.text();
                    })
                        .then(function (text) {
                        var spCell = _activeSection.querySelector(".sp-cell");
                        spCell.innerHTML = text;
                    });
                }
            }
        };
        var scrollEvents = {
            scrollPageUp: function () {
                var sec_id = "";
                if (_activePageIndex > 0) {
                    sec_id = _sectionIds[--_activePageIndex];
                }
                else {
                    if (_options.autoScrolling) {
                        _activePageIndex = _sectionIds.length - 1;
                        sec_id = _sectionIds[_activePageIndex];
                    }
                }
                if (sec_id === "") {
                    canScroll = true;
                    return;
                }
                scrollEvents.scrollToSection(sec_id);
            },
            scrollPageRight: function () {
                var sec_id = "";
                if (_activePageIndex > 0) {
                    sec_id = _sectionIds[--_activePageIndex];
                }
                else {
                    if (_options.autoScrolling) {
                        _activePageIndex = _sectionIds.length - 1;
                        sec_id = _sectionIds[_activePageIndex];
                    }
                }
                if (sec_id === "") {
                    canScroll = true;
                    return;
                }
                scrollEvents.scrollToSection(sec_id);
            },
            scrollPageDown: function () {
                var sec_id = "";
                if (_activePageIndex < _sectionIds.length - 1) {
                    sec_id = _sectionIds[++_activePageIndex];
                }
                else {
                    if (_options.autoScrolling) {
                        _activePageIndex = 0;
                        sec_id = _sectionIds[_activePageIndex];
                    }
                }
                if (sec_id === "") {
                    canScroll = true;
                    return;
                }
                scrollEvents.scrollToSection(sec_id);
            },
            scrollPageLeft: function () {
                var sec_id = "";
                if (_activePageIndex < _sectionIds.length - 1) {
                    sec_id = _sectionIds[++_activePageIndex];
                }
                else {
                    if (_options.autoScrolling) {
                        _activePageIndex = 0;
                        sec_id = _sectionIds[_activePageIndex];
                    }
                }
                if (sec_id === "") {
                    canScroll = true;
                    return;
                }
                scrollEvents.scrollToSection(sec_id);
            },
            scrollToSection: function (sectionId) {
                _activeSection = $.querySelector("[data-anchor='" + sectionId + "']");
                _activePageIndex = _sectionIds.indexOf(sectionId);
                if (_activeSection) {
                    htmlUtility.fetchView();
                    $e.style.transition = "all " + _options.transitionSpeed + "ms " + _options.easing + " 0s";
                    switch (scrollWay) {
                        case "horizontal":
                            pageIndex = _activePageIndex * window.innerWidth;
                            $e.style.transform = "translate3d(-" + pageIndex + "px, 0px, 0px)";
                            break;
                        case "vertical":
                            pageIndex = _activePageIndex * window.innerHeight;
                            if (_activeSection.offsetTop > 0) {
                                pageIndex = pageIndex > _activeSection.offsetTop ? pageIndex : _activeSection.offsetTop;
                            }
                            $e.style.transform = "translate3d(0px, -" + pageIndex + "px, 0px)";
                            break;
                    }
                    if (!_options.sameurl) {
                        location.hash = "#" + sectionId;
                    }
                }
            }
        };
        var eventListners = {
            keyDown: function (key) {
                switch (key.which) {
                    case 37:
                        if (canScroll && _options.navigation === "horizontal") {
                            canScroll = false;
                            scrollEvents.scrollPageRight();
                        }
                        break;
                    case 38:
                        if (canScroll && _options.navigation === "vertical") {
                            canScroll = false;
                            scrollEvents.scrollPageUp();
                        }
                        break;
                    case 39:
                        if (canScroll && _options.navigation === "horizontal") {
                            canScroll = false;
                            scrollEvents.scrollPageLeft();
                        }
                        break;
                    case 40:
                        if (canScroll && _options.navigation === "vertical") {
                            canScroll = false;
                            scrollEvents.scrollPageDown();
                        }
                        break;
                }
            },
            mouseWheel: function (e) {
                _scrollings.push(_lastScrollCount);
                e = e || window.event;
                var value = e.wheelDelta || -e.deltaY || -e.detail;
                var delta = Math.max(-1, Math.min(1, value));
                var horizontalDetection = typeof e.wheelDeltaX !== 'undefined' || typeof e.deltaX !== 'undefined';
                var isScrollingVertically = (Math.abs(e.wheelDeltaX) < Math.abs(e.wheelDelta)) || (Math.abs(e.deltaX) < Math.abs(e.deltaY) || !horizontalDetection);
                if (_options.scrollbar) {
                    e.preventDefault();
                }
                clearTimeout(scrollerTime);
                scrollerTime = setTimeout(function () {
                    if (canScroll && (_lastScrollCount === _scrollings.length)) {
                        canScroll = false;
                        _scrollings = [];
                        _lastScrollCount = 0;
                        clearInterval(scrollerTime);
                        var averageEnd = utilityMethod.getAverage(_scrollings, 10);
                        var averageMiddle = utilityMethod.getAverage(_scrollings, 70);
                        var isAccelerating = averageEnd >= averageMiddle;
                        if (isAccelerating && isScrollingVertically) {
                            if (delta < 0) {
                                _options.navigation === "vertical" ? scrollEvents.scrollPageDown() : scrollEvents.scrollPageLeft();
                            }
                            else {
                                _options.navigation === "vertical" ? scrollEvents.scrollPageUp() : scrollEvents.scrollPageRight();
                            }
                        }
                    }
                }, 100);
                _lastScrollCount = _scrollings.length;
                return false;
            },
            windowResize: function () {
                var activeId;
                document.querySelectorAll(".section").forEach(function (element) {
                    htmlUtility.setSectionHeight(element);
                    htmlUtility.setSectionHeight(element.querySelector(".sp-cell"));
                    if (element.classList.contains("active")) {
                        activeId = element.getAttribute("data-anchor");
                    }
                });
                var ele = $.querySelector("#sp-hb-menu-bg");
                if (ele) {
                    ele.style.height = window.innerHeight + "px";
                }
                scrollEvents.scrollToSection(activeId);
            },
            transitionStart: function (e) {
                var _a, _b;
                var section = $.querySelector(".section.active");
                section === null || section === void 0 ? void 0 : section.classList.remove("active");
                if (_options.pageTransitionStart instanceof Function) {
                    _options.pageTransitionStart(section, _activeSection);
                }
                var prevId = section === null || section === void 0 ? void 0 : section.getAttribute("data-anchor");
                var id = _activeSection === null || _activeSection === void 0 ? void 0 : _activeSection.getAttribute("data-anchor");
                (_a = $.querySelector(".nav-link[href='#" + prevId + "']")) === null || _a === void 0 ? void 0 : _a.classList.remove("active");
                (_b = $.querySelector(".nav-link[href='#" + id + "']")) === null || _b === void 0 ? void 0 : _b.classList.add("active");
            },
            transitionEnd: function (e) {
                _activeSection === null || _activeSection === void 0 ? void 0 : _activeSection.classList.add("active");
                canScroll = true;
                if (_options.pageTransitionEnd instanceof Function) {
                    _options.pageTransitionEnd(_activeSection);
                }
            },
            swipeUp: function () {
                if (canScroll) {
                    canScroll = false;
                    scrollEvents.scrollPageDown();
                }
            },
            swipeDown: function () {
                if (canScroll) {
                    canScroll = false;
                    scrollEvents.scrollPageUp();
                }
            },
            swipeLeft: function () {
                if (canScroll) {
                    canScroll = false;
                    scrollEvents.scrollPageLeft();
                }
            },
            swipeRight: function () {
                if (canScroll) {
                    canScroll = false;
                    scrollEvents.scrollPageRight();
                }
            },
            navigationClick: function (e) {
                var _a;
                var sectionId = e.target.getAttribute("data-href");
                scrollEvents.scrollToSection(sectionId);
                if (((_a = _options.hamburger) === null || _a === void 0 ? void 0 : _a.closeOnNavigation) !== false) {
                    eventListners.onHamburgerMenuClick();
                }
            },
            onHamburgerMenuClick: function () {
                $.querySelector(".sp-hb-menu").classList.toggle("sp-hb-change");
                $.querySelector(".sp-hb-nav").classList.toggle("sp-hb-change");
                $.querySelector(".sp-hb-menu-bg").classList.toggle("sp-hb-change-bg");
            }
        };
        var utilityMethod = {
            initSections: function () {
                var _a, _b;
                htmlUtility.setInitialStyle();
                var navUl;
                if (_options.anchors) {
                    if (!_options.hamburger) {
                        navUl = htmlUtility.setNavigationMenu();
                    }
                    else {
                        navUl = htmlUtility.setHamburgerMenu();
                    }
                }
                _options.sections.forEach(function (section, index) {
                    var _a;
                    var anchorId = "page" + (index + 1);
                    var sectionEle = htmlUtility.setSection(section, index + 1);
                    sectionEle.setAttribute("data-anchor", anchorId);
                    if (typeof (section.sectionClass) === 'string') {
                        section.sectionClass = (_a = section.sectionClass) === null || _a === void 0 ? void 0 : _a.split(',');
                    }
                    var sectionClass = section.sectionClass || [];
                    var cellEle = htmlUtility.getCellElement(sectionClass, section.verticalAlignMiddle);
                    cellEle.innerHTML = sectionEle.innerHTML;
                    sectionEle.innerHTML = "";
                    sectionEle.appendChild(cellEle);
                    $e.appendChild(sectionEle);
                    _sectionIds.push(anchorId);
                    if (_options.anchors) {
                        var anchorClass = ["nav-link", "text-nowrap"];
                        if (section.anchorClass) {
                            if (typeof (section.anchorClass) === 'string') {
                                section.anchorClass = section.anchorClass.split(',');
                            }
                            anchorClass = __spreadArrays(anchorClass, section.anchorClass);
                        }
                        var navLi = htmlUtility.setNavigationLink(anchorClass, section.anchor, anchorId);
                        navUl.appendChild(navLi);
                    }
                    if (section.backgroundColor) {
                        htmlUtility.setBackgroundColor(sectionEle, section.backgroundColor);
                    }
                });
                if (_options.navigation.toLowerCase() === "horizontal") {
                    htmlUtility.setSectionHorizontal($e);
                    scrollWay = "horizontal";
                }
                var activeId = _sectionIds[0];
                if (!_options.sameurl) {
                    var hash = (_a = location.hash) === null || _a === void 0 ? void 0 : _a.replace("#", "");
                    if (hash) {
                        activeId = hash;
                    }
                }
                else {
                    var active = document.querySelector(".section.active");
                    if (active !== null) {
                        activeId = active.getAttribute("data-anchor");
                    }
                }
                scrollEvents.scrollToSection(activeId);
                var id = _activeSection === null || _activeSection === void 0 ? void 0 : _activeSection.getAttribute("data-anchor");
                (_b = $.querySelector(".nav-link[href='#" + activeId + "']")) === null || _b === void 0 ? void 0 : _b.classList.add("active");
                utilityMethod.addEventListeners($e);
                utilityMethod.addToPublicAPI();
            },
            addEventListeners: function ($element) {
                if (_options.keyboardNavigation) {
                    document.removeEventListener("keydown", eventListners.keyDown);
                    document.addEventListener("keydown", eventListners.keyDown);
                }
                document.removeEventListener("wheel", eventListners.mouseWheel);
                document.addEventListener("wheel", eventListners.mouseWheel);
                window.removeEventListener('resize', eventListners.windowResize);
                window.addEventListener('resize', eventListners.windowResize);
                $element.removeEventListener('transitionstart', eventListners.transitionStart);
                $element.addEventListener('transitionstart', eventListners.transitionStart);
                $element.removeEventListener('transitionend', eventListners.transitionEnd);
                $element.addEventListener('transitionend', eventListners.transitionEnd);
                if (scrollWay == "horizontal") {
                    document.addEventListener('swiped-left', eventListners.swipeLeft);
                    document.addEventListener('swiped-right', eventListners.swipeRight);
                }
                else {
                    document.addEventListener('swiped-up', eventListners.swipeUp);
                    document.addEventListener('swiped-down', eventListners.swipeDown);
                }
            },
            getAverage: function (eleList, num) {
                var sum = 0;
                var lastEles = eleList.slice(Math.max(eleList.length - num, 1));
                for (var i = 0; i < lastEles.length; i++) {
                    sum = sum + lastEles[i];
                }
                return Math.ceil(sum / num);
            },
            addToPublicAPI: function () {
                _this.api.gotoPage = scrollEvents.scrollToSection;
                if (scrollWay === "horizontal") {
                    _this.api.navigateToNextPage = scrollEvents.scrollPageRight;
                    _this.api.navigateToPrevPage = scrollEvents.scrollPageLeft;
                }
                else {
                    _this.api.navigateToNextPage = scrollEvents.scrollPageDown;
                    _this.api.navigateToPrevPage = scrollEvents.scrollPageUp;
                }
                _this.api.getMenuItems = function () {
                    return $.querySelectorAll('.nav-item');
                };
                _this.api.getActivePage = function () {
                    var sec_id = _sectionIds[_activePageIndex];
                    return $.querySelector("[data-anchor='" + sec_id + "']");
                };
            }
        };
        utilityMethod.initSections();
    }
    return SitePage;
}());
;/*!
 * swiped-events.js - v1.0.9
 * Pure JavaScript swipe events
 * https://github.com/john-doherty/swiped-events
 * @inspiration https://stackoverflow.com/questions/16348031/disable-scrolling-when-touch-moving-certain-element
 * @author John Doherty <www.johndoherty.info>
 * @license MIT
 */
! function(t, e) { "use strict"; "function" != typeof t.CustomEvent && (t.CustomEvent = function(t, n) { n = n || { bubbles: !1, cancelable: !1, detail: void 0 }; var u = e.createEvent("CustomEvent"); return u.initCustomEvent(t, n.bubbles, n.cancelable, n.detail), u }, t.CustomEvent.prototype = t.Event.prototype), e.addEventListener("touchstart", function(t) { if ("true" === t.target.getAttribute("data-swipe-ignore")) return;
        o = t.target, l = Date.now(), n = t.touches[0].clientX, u = t.touches[0].clientY, a = 0, i = 0 }, !1), e.addEventListener("touchmove", function(t) { if (!n || !u) return; var e = t.touches[0].clientX,
            l = t.touches[0].clientY;
        a = n - e, i = u - l }, !1), e.addEventListener("touchend", function(t) { if (o !== t.target) return; var e = parseInt(o.getAttribute("data-swipe-threshold") || "20", 10),
            s = parseInt(o.getAttribute("data-swipe-timeout") || "500", 10),
            r = Date.now() - l,
            c = "";
        Math.abs(a) > Math.abs(i) ? Math.abs(a) > e && r < s && (c = a > 0 ? "swiped-left" : "swiped-right") : Math.abs(i) > e && r < s && (c = i > 0 ? "swiped-up" : "swiped-down"); "" !== c && o.dispatchEvent(new CustomEvent(c, { bubbles: !0, cancelable: !0 }));
        n = null, u = null, l = null }, !1); var n = null,
        u = null,
        a = null,
        i = null,
        l = null,
        o = null }(window, document);