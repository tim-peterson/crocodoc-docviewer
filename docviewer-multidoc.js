var CoreViewer = function (c) {
    var k = this;
    var y = jQuery;
    this.zoom = function (Q) {
        t(Q)
    };
    this.scrollTo = function (Q, R) {
        N(Q, R)
    };
    this.bind = function (Q, R) {
        y(k).bind(Q, R)
    };
    this.ready = function (Q) {
        F ? Q(P("ready")) : y(k).bind("ready", Q)
    };
    this.status = function () {
        return M
    };
    var h = null;
    var J = null;
    var o = null;
    var d = null;
    var b = null;
    var G = [];
    var K = null;
    var z = null;
    var e = 0;
    var w, p = null;
    var s = null;
    var I = {};
    var F = false;
    var E, D, v, O, C = null;
    var A = false;
    var u = false;
    var M = null;
    var g = function () {
        if (y.fn.jquery.substr(0, 3) < 1.6) {
            return console.error("jQuery 1.6+ is required")
        }
        if(typeof _doc!='undefined')  console.log("_doc"+_doc);
        else console.log("NO _doc");
        h = _doc;
        var T = (h.status == 4);
        var S = (h.metadata != null && !T);
        var R = (h.pageStatuses.indexOf("0") == -1 && S);

        //console.log("c.id:"+c.id);
        //J = y('<div class="doc "></div>').appendTo(y("#" + c.id).addClass("docviewer")).get(0);
        J = y('<div id="'+c.id+'-doc" class="doc slider"></div>').appendTo(y("#" + c.id).addClass("docviewer")).get(0); //TRP 6/14/13
        //console.log("J:");
        //console.log(J);
        if (!R) {
            var Q = new StatusUpdater(J, h);
            y(Q).bind("statusupdate", m);
            y(k).bind("fail", r)
        }
        m({
            type: "statusupdate",
            viewable: S,
            failed: T,
            step: h.step,
            pages: h.pageStatuses
        })
    };
    var L = function () {
        o = h.assetsLocation;
        d = h.metadata;
        var aa = h.pageStatuses;
        var R = (h.pageStatuses.indexOf("0") == -1 && h.metadata && h.status != 4);
        var Z = (R) ? "full" : "init";
        var X = (y.browser.msie && y.browser.version <= 8) ? ("ie" + y.browser.version).substr(0, 3) : "std";
        var W = o + "css/" + X + "-" + Z + ".css";
        if (document.createStyleSheet) {
            document.createStyleSheet(W)
        } else {
            y("head").append('<link rel="stylesheet" href="' + W + '" type="text/css" />')
        }
        q();
        var S = d.defaults;
        for (var V = 0; V < d.numpages; V++) {
            var T = S.width;
            var ab = S.height;
            var Y = String(V + 1);
            if (Y in d.pages) {
                T = d.pages[Y].width;
                ab = d.pages[Y].height
            }
            var U = (T * CoreViewer.PXPT_RATIO) / 10;
            var ae = (ab * CoreViewer.PXPT_RATIO) / 10;
            //var ac = '<div class="page-outer" style="width:{width}em; height:{height}em;"><div id="Page{num}" class="page" style="width:{width}em; height:{height}em;"></div></div>';
            var ac = '<div class="page-outer slide item" style="width:{width}em; height:{height}em;"><div id="Page{num}-'+c.id+'" class="page" style="width:{width}em; height:{height}em;"></div></div>'; //TRP 6/15/13
            ac = ac.replace(/{width}/g, U).replace(/{height}/g, ae).replace(/{num}/g, Y);
            y(ac).appendTo(J);
            //y(ac).appendTo(y("#" + c.id+"-doc")); //TRP 6/14/13
            G.push([T, ab])
        }
        t(c.zoom);
        N(c.page || 1);
        b = new LazyLoader(J, aa, d, o, c);
        y(k).bind("zoom resize statusupdate", function (af) {
            y(b).triggerHandler(af)
        });
        y(b).bind("pagechange unavailable", function (af) {
            y(k).triggerHandler(af)
        });
        var ad = J.offsetWidth * J.offsetHeight;
        var Q = function () {
            var af = J.offsetWidth * J.offsetHeight;
            if (af && ad != af) {
                ad = af;
                n()
            }
        };
        y(window).resize(Q);
        setInterval(Q, 50);
        y(k).triggerHandler(P("ready"));
        F = true
    };
    var P = function (Q) {
        return {
            type: Q,
            numpages: d.numpages,
            zoom: z,
            trueZoom: K,
            zoomIn: w,
            zoomOut: p,
            zoomMode: s
        }
    };
    var q = function () {
        var T = false;
        var S = /Windows NT 5/.test(navigator.userAgent);
        var R = /(iPhone|iPod|iPad)/.test(navigator.userAgent);
        var U = !! ("ontouchstart" in window);
        var Q = true;
        if (y.browser.mozilla && y.browser.version.split(".")[0] >= 6 && !S) {
            T = true
        }
        if (y.browser.msie && y.browser.version.split(".")[0] >= 9 && !S) {
            T = true
        }
        if (U) {
            if (y.browser.webkit && y.browser.version < 536.26) {
                e = 0.8;
                Q = false
            }
        }
        if (T) {
            y(J).addClass("subpx")
        } else {
            if (!U) {
                y(J).addClass("no-subpx")
            } else {
                y(J).addClass("mobile");
                if ((R && y.browser.version < 536.26) || d.numpages > 32) {
                    y(J).addClass("no-inertia")
                }
                if (!Q) {
                    y(J).addClass("no-subpx");
                    y(J).bind("touchstart", H);
                    y(J).bind("touchmove", B)
                } else {
                    y(J).bind("gesturestart", a);
                    y(J).bind("gesturechange", f);
                    y(J).bind("gestureend", x);
                    y(J).bind("touchmove", function () {
                        if (A) {
                            return false
                        }
                    })
                }
            }
        }
    };
    var N = function (S, U) {
        var R = null;
        if (S == "prev" && b.currentPage > 1) {
            R = b.currentPage - 1
        } else {
            if (S == "next" && b.currentPage < d.numpages) {
                R = b.currentPage + 1
            } else {
                if (typeof (S) == "number") {
                    R = S
                }
            }
        } if (R) {
            var Q = (U || 0) * DocViewer.PXPT_RATIO * K;
            //var T = y(J).scrollTop() + y("#Page" + R).parent().position().top + Q;
            var T = y(J).scrollTop() + y("#Page" + R+'-'+c.id).parent().position().top + Q; //TRP 6/15/13
            y(J).scrollTop(Math.round(T))
        }
    };
    var t = function (S) {
        if (Number(S)) {
            s = null;
            l(Number(S))
        } else {
            if (S == "fitWidth") {
                s = "fitWidth";
                l(i("fitWidth"))
            } else {
                if (S == "fitHeight") {
                    s = "fitHeight";
                    l(i("fitHeight"))
                } else {
                    if (S == "auto") {
                        s = "auto";
                        l(i("auto"))
                    } else {
                        if (S == "in" || S == "out") {
                            var R = j(S);
                            if (R.zoom) {
                                s = R.mode;
                                l(R.zoom)
                            }
                        } else {
                            if (S == null) {
                                if (!z) {
                                    s = null;
                                    var Q = i("auto");
                                    if (Q == i("fitWidth")) {
                                        s = "fitWidth"
                                    } else {
                                        if (Q == i("fitHeight")) {
                                            s = "fitHeight"
                                        }
                                    }
                                    l(Q)
                                } else {
                                    if (s) {
                                        l(i(s))
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    var j = function (W) {
        var U = NaN;
        var S = {};
        var R = i("fitWidth");
        var X = i("fitHeight");
        if (e > 0) {
            S[e] = null
        }
        if (R >= e) {
            S[R] = "fitWidth"
        }
        if (X >= e) {
            S[X] = "fitHeight"
        }
        for (var T = 0; T < CoreViewer.ZOOM_LEVELS.length; T++) {
            var Q = CoreViewer.ZOOM_LEVELS[T];
            if (Q >= e) {
                S[CoreViewer.ZOOM_LEVELS[T]] = null
            }
        }
        var V = function (Z, aa) {
            return (W == "in") ? (Z > aa) : (Z < aa)
        };
        for (var Y in S) {
            if (V(Y, z) && !V(Y, U)) {
                U = Y
            }
        }
        return {
            zoom: U,
            mode: S[U]
        }
    };
    var l = function (Z) {
        if (b) {
            var V = b.visiblePages[0];
            //var T = y("#Page" + V).offset().top - y(J).offset().top;
            var T = y("#Page" + V+'-'+c.id).offset().top - y(J).offset().top; //TRP 6/15/13
            var S = y(J).scrollLeft();
            var Q = y(".page-outer", J).width();
            //var Y = y("#Page" + V).height()
            var Y = y("#Page" + V+'-'+c.id).height(); //TRP 6/15/13
        }
        z = Math.max(Z, e);
        if (y.browser.msie) {
            var R = 10 * z * (3 / 4);
            if (s) {
                var X = (z == i("fitHeight")) ? Math.ceil : Math.floor;
                if (y.browser.msie && y.browser.version <= 7) {
                    R -= 0.025
                }
                R = X(R * 20) / 20
            }
            y(J).css("font-size", (R) + "pt");
            if (y.browser.msie && y.browser.version <= 7) {
                y(".page-outer", J).css("zoom", "normal").css("zoom", 1)
            }
        } else {
            y(J).css("font-size", (10 * z) + "px")
        }
        K = (y(".page").width() / G[0][0]) / CoreViewer.PXPT_RATIO;
        if (b) {
           // var U = y("#Page" + V);
            var U = y("#Page" + V+'-'+c.id);  //TRP 6/15/13
            var W = U.offset().top - y(J).offset().top + y(J).scrollTop();
            T *= (T > 0) ? 1 : U.height() / Y;
            y(J).scrollTop(W - T);
            S += (y(".page-outer", J).width() - Q) / 2;
            y(J).scrollLeft(S)
        }
        w = !isNaN(j("in")["zoom"]);
        p = !isNaN(j("out")["zoom"]);
        y(k).triggerHandler(P("zoom"))
    };
    var i = function (T) {
        if (T == "fitWidth") {
            var X = J.clientWidth || y(J).width() - 17;
            var S = (X < 750) ? 36 : y(".page-outer").outerWidth() - y(".page-outer").width();
            var Q = d.defaults.width * CoreViewer.PXPT_RATIO;
            return (X - S) / Q
        } else {
            if (T == "fitHeight") {
                var R = y(J).height();
                var S = y(".page-outer").outerHeight(true) - y(".page-outer").height();
                var W = d.defaults.height * CoreViewer.PXPT_RATIO;
                return (R - S) / W
            } else {
                if (T == "auto") {
                    if (d.defaults.width > d.defaults.height) {
                        var V = i("fitWidth");
                        var U = i("fitHeight");
                        return Math.min(V, U)
                    } else {
                        var V = i("fitWidth");
                        return Math.min(1, V)
                    }
                }
            }
        }
    };
    var m = function (Q) {
        if (!F && Q.viewable) {
            L()
        } else {
            if (Q.failed) {
                setTimeout(function () {
                    y(k).triggerHandler("fail")
                }, 0)
            }
        }
        M = Q;
        y(k).triggerHandler(Q)
    };
    var r = function () {
        y(J).hide();
        var Q = '<div class="error-overlay"><div class="msg"><h3>Preview not Available</h3><p>An error occured while converting this document.</p></div></div>';
        y(Q).insertAfter(J)
    };
    var n = function () {
        if (s) {
            l(i(s))
        }
        w = !isNaN(j("in")["zoom"]);
        p = !isNaN(j("out")["zoom"]);
        y(k).triggerHandler(P("resize"))
    };
    var H = function (Q) {
        Q = Q.originalEvent;
        if (Q.touches.length == 1) {
            E = Q.touches[0].pageX;
            D = Q.touches[0].pageY;
            v = y(this).scrollTop();
            O = y(this).scrollLeft()
        }
    };
    var B = function (R) {
        R = R.originalEvent;
        if (R.touches.length == 1) {
            var Q = R.touches[0].pageX;
            var S = R.touches[0].pageY;
            y(this).scrollTop(v + (D - S));
            y(this).scrollLeft(O + (E - Q))
        }
        return false
    };
    var a = function (Q) {
        A = true;
        u = false
    };
    var f = function (Q) {
        if (!u) {
            Q = Q.originalEvent;
            if (Q.scale > 1.25) {
                t("in");
                u = true
            } else {
                if (Q.scale < 0.75) {
                    t("out");
                    u = true
                }
            }
        }
    };
    var x = function (Q) {
        A = false
    };
    g() //TRP 6/15/13;

    //return c; //TRP 6/15/13
};
CoreViewer.PXPT_RATIO = 110 / 72;
CoreViewer.ZOOM_LEVELS = [0.5, 0.75, 1, 1.25, 1.5, 2, 3];
var DocViewer = CoreViewer;
//var LazyLoader = function (l, a, n, d) {
var LazyLoader = function (l, a, n, d, docViewerObj) { //TRP 6/15/13
    var q = this;
    var f = jQuery;
    this.visiblePages = [];
    this.currentPage = null;
    var b = [];
    var k = [];
    var s = [];
    var z = {};
    var u = [];
    var A = !! ("ontouchstart" in window);
    var c = function () {
        for (var F = 0; F < n.numpages; F++) {
            var D = (a.charAt(F) || "1") == "1";
            s.push(D ? 0 : -1)
        }
        viewersize = [f(l).width(), f(l).height()];
        t();
        f(l).scroll(B);
        f(q).bind("zoom", o);
        f(q).bind("resize", v);
        f(q).bind("statusupdate", m);
        f(l).append('<div class="font-loader"></div>');
        window.jsonp_PageLoaded = function (H, I, J) {
            if (true || location.search.indexOf("slow") == -1) {
                y(I, J)
            } else {
                setTimeout(function () {
                    y(I, J)
                }, 1500)
            }
        };
        if (A) {
            if (a.indexOf("0") == -1) {
                var G = [];
                for (var F = 0; F < n.fonts.length; F++) {
                    var E = n.fonts[F];
                    G.push(E.id)
                }
                h(G)
            }
        }
        x(2500)
    };
    var B = function (E) {
        var D = f(l).scrollTop();
        setTimeout(function () {
            if (D == f(l).scrollTop()) {
                x()
            }
        }, 50)
    };
    var v = function () {
        x()
    };
    var o = function () {
        t();
        x()
    };
    var m = function (D) {
        C(D.pages)
    };
    var C = function (E) {
        for (var D = 0; D < n.numpages; D++) {
            if (s[D] == -1 && (E.charAt(D) || "1") == "1") {
                s[D] = 0
            }
        }
        x()
    };
    var t = function () {
        b = [];
        k = [];
        var J = f(l).scrollTop();
        var G = f(l).offset().top;
        var D = f(".page", l);
        for (var E = 0; E < D.length; E++) {
            var I = D[E];
            var H = f(I).offset().top - G + J;
            var F = H + f(I).height();
            b.push(H);
            k.push(F)
        }
    };
    var x = function (D) {
        var J = f(l).scrollTop();
        var I = J + f(l).height();
        var F = Math.max(0, e(b, (J + I) / 2));
        if (q.currentPage != F + 1) {
            q.currentPage = F + 1;
            f(q).trigger({
                type: "pagechange",
                page: q.currentPage
            });
            j(F)
        }
        var E = Math.min(n.numpages - 1, p(k, J));
        var H = Math.max(0, e(b, I));
        q.visiblePages = [];
        for (var G = E; G <= H; G++) {
            q.visiblePages.push(G + 1);
            j(G)
        }
        D = D || 1250;
        var E = Math.min(n.numpages - 1, p(k, J - D));
        var H = Math.max(0, e(b, I + D));
        for (var G = E; G <= H; G++) {
            j(G)
        }
        if (A) {
            r()
        }
        w()
    };
    var j = function (F) {
        if (s[F] == -1) {
            return false
        } else {
            if (s[F] < 1) {
                s[F] = 1;
                //var E = f("#Page" + (F + 1));
                var E = f("#Page" + (F + 1)+'-'+docViewerObj.id); //TRP 6/15/13
                //console.log("#Page docViewerObj.id"+docViewerObj.id);
                E.addClass("loading").append('<span class="loading-msg">Loading...</span>');
                f.getScript(d + "doc." + F + ".js");
                var J = E.attr("style");
                var I = '<div class="layer img"><img class="bg-img" style="{style}" src="{loc}images/page-{index}.png" /></div>';
                I = I.replace(/{style}/g, J).replace(/{index}/g, F).replace(/{loc}/g, d);
                f(I).appendTo(E).error(function (K) {
                    f(q).trigger({
                        type: "unavailable",
                        page: F + 1
                    })
                });
                var H = [];
                for (var G = 0; G < n.fonts.length; G++) {
                    var D = n.fonts[G];
                    if (D.first - 1 <= F && D.last - 1 >= F && !z[D.id]) {
                        H.push(D.id)
                    }
                }
                h(H)
            }
        }
    };
    var h = function (F) {
        for (var D = 0; D < F.length; D++) {
            var G = F[D];
            f(".font-loader").append('<span class="f' + G + '">&nbsp;</span>');
            z[G] = true
        }
        if (f.browser.msie && f.browser.version <= 8) {
            for (var D = 0; D < F.length; D++) {
                var G = F[D];
                var E = f(".font-loader .f" + G).css("font-family").replace(/['"]/g, "");
                if (E.slice(0, 1) != "f") {
                    u.push(G)
                }
            }
        }
    };
    var w = function () {
        if (u.length > 0 && f.browser.msie && f.browser.version <= 8) {
            if (document.styleSheets.length == 30) {
                var G = [];
                for (var F = 0; F < n.fonts.length; F++) {
                    if (!z[n.fonts[F].id]) {
                        G.push(n.fonts[F].id)
                    }
                }
                h(G)
            }
            var H = "";
            while (u.length > 0) {
                var I = u.pop(0);
                var D = d + "fonts/" + I + ".eot";
                H += ".f" + I + " { font-family: 'f" + I + "', sans-serif; } ";
                H += "@font-face { font-family: 'f" + I + "'; src: url('" + D + "'); } "
            }
            var E = document.createElement("style");
            E.setAttribute("type", "text/css");
            f("head").append(E);
            E.styleSheet.cssText = H
        }
    };
    var y = function (E, G) {
        //var D = f("#Page" + (E + 1));
        var D = f("#Page" + (E + 1)+'-'+docViewerObj.id); //TRP 6/15/13
        f(".loading-msg", D).hide();
        var F = f(G).find(".layer.text");
        i(F);
        f(F).insertAfter(D.find(".layer.img"));
        s[E] = 2
    };
    var p = function (F, D) {
        for (var E = 0; E < F.length && F[E] < D; E++) {}
        return E
    };
    var e = function (F, D) {
        for (var E = F.length - 1; E >= 0 && F[E] > D; E--) {}
        return E
    };
    var i = function (F) {
        if (A) {
            var D = F.find(".tb");
            for (var E = 0; E < D.length; E++) {
                var H = D[E];
                var G = {
                    top: 0,
                    marginTop: 0
                };
                f(H).find(".ln").each(function () {
                    var I = f(this).attr("style");
                    I += "top:" + (G.top) + "em; ";
                    I += "; position:absolute;";
                    f(this).attr("style", I);
                    var J = g(this);
                    G.top += (J.height + J.marginTop)
                })
            }
        }
    };
    var g = function (H) {
        var J = {};
        var E = {
            left: /left:([\d\.\-]+)em/,
            top: /top:([\d\.\-]+)em/,
            width: /width:([\d\.\-]+)em/,
            height: /height:([\d\.\-]+)em/,
            marginLeft: /margin-left:([\d\.\-]+)em/,
            marginTop: /margin-top:([\d\.\-]+)em/
        };
        var G = f(H).attr("style");
        for (var F in E) {
            var I = E[F];
            var D = I.exec(G);
            var K = D ? Number(D[1]) : 0;
            J[F] = K
        }
        return J
    };
    var r = function () {
        for (var E = 1; E <= n.numpages; E++) {
            var D = (E >= q.currentPage - 3 && E <= q.currentPage + 3);
            //f("#Page" + E).toggleClass("hidden", !D)
            f("#Page" + E+'-'+docViewerObj.id).toggleClass("hidden", !D) //6/15/13
        }
    };
    c()
};
var StatusUpdater = function (g, r) {
    var j = this;
    var e = jQuery;
    var f = null;
    var c = null;
    var a = 0;
    var o = 0;
    var l = false;
    var q = false;
    var d = typeof (window.io) !== "undefined" && typeof (window.io.connect) === "function";
    var h = null;
    if (d) {
        var i = r.socketioHost;
        var k = {
            transports: ["websocket", "xhr-polling"]
        };
        h = io.connect(i + "docstatus", k)
    }
    var b = function () {
        q = (r.status == 4);
        l = (r.metadata != null && !q);
        if (q) {
            return
        }
        p();
        if (d) {
            h.on("status", function (s) {
                s = JSON.parse(s);
                m(s)
            }).on("disconnect", function () {}).on("connect", function () {
                h.emit("subscribe", {
                    session_string: r.session
                })
            }).on("subscribed", function () {
                n()
            }).on("connect_failed", function () {
                d = false;
                n()
            }).on("error", function () {
                d = false;
                n()
            })
        } else {
            setTimeout(n, 3000)
        }
    };
    var m = function (v) {
        var u = v.status;
        var y = v.pageStatuses || "";
        var x = v.metadata;
        var s = v.step;
        if ((u == 3 || u == 4) && h && h.socket) {
            h.socket.disconnect()
        }
        var t = (y.match(/1/g) || []).length;
        var A = {
            DOWNLOADING: 1,
            PROCESSING: 2,
            CONVERTING: 3,
            DONE: 4
        };
        var w = A[s] || 0;
        var z = 10 * u + w + t / 100000;
        if (z > o || (!r.metadata && x)) {
            o = Math.max(o, z);
            r.status = u;
            r.step = s;
            r.pageStatuses = y;
            r.metadata = x ? x : r.metadata;
            q = (r.status == 4);
            l = (r.metadata != null && !q);
            p();
            e(j).trigger({
                type: "statusupdate",
                viewable: l,
                failed: q,
                step: s,
                pages: y
            })
        }
    };
    var n = function () {
        var s = r.webserviceUrl;
        var t = s + "document/status?session=[session]&callback=?";
        t = t.replace("[session]", r.session);
        if (!r.metadata) {
            t += "&include-metadata=true"
        }
        e.getJSON(t, function (u) {
            console.log('u:');
            console.log(u);
            m(u);
            if (!d) {
                if (r.status != 3 && r.status != 4) {
                    if (a < 60) {
                        a++;
                        setTimeout(n, 3000)
                    } else {
                        e(j).trigger({
                            type: "statusupdate",
                            viewable: false,
                            failed: true,
                            step: null,
                            pages: r.pageStatuses
                        })
                    }
                }
            }
        })
    };
    var p = function () {
        if (q) {
            e(c).hide()
        } else {
            if (l) {
                if (!f) {
                    var u = '<div class="inc-loading" style="display:none;"><div class="msg">Processing page <span class="numerator">1</span>/<span class="denominator">1</span>...</div><div class="bar"><div class="progress"></div></div></div>';
                    f = e(u).insertAfter(g).get(0)
                }
                e(c).hide();
                var s = r.pageStatuses;
                var v = s.length;
                var t = s.indexOf("0") + 1;
                if (t) {
                    e(f).show();
                    e(".denominator", f).text(v);
                    e(".numerator", f).text(t);
                    e(".progress", f).width("" + Math.round((t - 1) / v * 100) + "%")
                } else {
                    e(".msg", f).text("Complete");
                    e(".progress", f).width("100%");
                    e(f).delay(2500).fadeOut()
                }
            } else {
                if (!c) {
                    var u = '<div class="conversion-overlay"><div class="msg"><span>Generating preview</span></div></div>';
                    c = e(u).insertAfter(g).get(0)
                }
            }
        }
    };
    b()
};
(function () {
    var b = '.docviewer { padding:0; } .docviewer .doc { margin:0; padding:0; position:absolute; height:100%; width:100%; overflow:auto; overflow-y:scroll; } .docviewer .doc { font-size:10px; } .docviewer .font-loader { position:fixed; top:0; right:0; height:1px; overflow:hidden; } .docviewer .font-loader span { display:inline-block; width:1px; height:1px; } .docviewer .page-outer { margin:10px auto; padding:5px 18px; position:relative; } .docviewer .page { background:white; position:relative; overflow:hidden; } .docviewer .page .loading-msg { display:block; position:absolute; top:33%; width:100%; text-align:center; margin-top:-7px; z-index:10; font-weight:bold; color:#aaa; font-size:14px; } .docviewer .inc-loading { position:absolute; bottom:10px; right:24px; width:200px; text-align:center; z-index:10; } .docviewer .inc-loading .bar { height:4px; width:180px; margin:2px auto; } .docviewer .inc-loading .bar .progress { height:100%; width:0%; float:left; } .docviewer .conversion-overlay { position:absolute; top:0; left:0; right:0; bottom:0; text-align:center; font-family:Arial,Helvetica,sans-serif; } .docviewer .conversion-overlay .msg { position:absolute; top:45%; left:50%; height:20px; width:200px; margin:-10px 0 0 -100px; } .docviewer .conversion-overlay .msg span { font-size:16px; padding-left:24px; background:url("data:image/gif;base64,R0lGODlhEAALAPQAAP///wAAANra2tDQ0Orq6gYGBgAAAC4uLoKCgmBgYLq6uiIiIkpKSoqKimRkZL6+viYmJgQEBE5OTubm5tjY2PT09Dg4ONzc3PLy8ra2tqCgoMrKyu7u7gAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCwAAACwAAAAAEAALAAAFLSAgjmRpnqSgCuLKAq5AEIM4zDVw03ve27ifDgfkEYe04kDIDC5zrtYKRa2WQgAh+QQJCwAAACwAAAAAEAALAAAFJGBhGAVgnqhpHIeRvsDawqns0qeN5+y967tYLyicBYE7EYkYAgAh+QQJCwAAACwAAAAAEAALAAAFNiAgjothLOOIJAkiGgxjpGKiKMkbz7SN6zIawJcDwIK9W/HISxGBzdHTuBNOmcJVCyoUlk7CEAAh+QQJCwAAACwAAAAAEAALAAAFNSAgjqQIRRFUAo3jNGIkSdHqPI8Tz3V55zuaDacDyIQ+YrBH+hWPzJFzOQQaeavWi7oqnVIhACH5BAkLAAAALAAAAAAQAAsAAAUyICCOZGme1rJY5kRRk7hI0mJSVUXJtF3iOl7tltsBZsNfUegjAY3I5sgFY55KqdX1GgIAIfkECQsAAAAsAAAAABAACwAABTcgII5kaZ4kcV2EqLJipmnZhWGXaOOitm2aXQ4g7P2Ct2ER4AMul00kj5g0Al8tADY2y6C+4FIIACH5BAkLAAAALAAAAAAQAAsAAAUvICCOZGme5ERRk6iy7qpyHCVStA3gNa/7txxwlwv2isSacYUc+l4tADQGQ1mvpBAAIfkECQsAAAAsAAAAABAACwAABS8gII5kaZ7kRFGTqLLuqnIcJVK0DeA1r/u3HHCXC/aKxJpxhRz6Xi0ANAZDWa+kEAA7AAAAAAAAAAAA") no-repeat left center; *padding-left:0; *background:none; } .docviewer .error-overlay { position:absolute; top:0; left:0; right:0; bottom:0; text-align:center; font-family:Arial,Helvetica,sans-serif; z-index:2; background:#fff; } .docviewer .error-overlay .msg { position:absolute; top:45%; left:50%; height:20px; width:290px; margin:-10px 0 0 -145px; } .docviewer .error-overlay .msg h3 { font-size:16px; font-weight:bold; margin:0; } .docviewer .error-overlay .msg p { font-size:13px; margin:5px 0; } .doc.mobile { -webkit-overflow-scrolling:touch; } .doc.mobile.no-inertia { -webkit-overflow-scrolling:auto; } .doc.mobile .ln.x span { white-space:nowrap; } .doc.mobile .page.hidden .layer { display:none; } .docviewer .doc { background:#eee; } .docviewer .page { outline:1px solid #BBB; } .docviewer .inc-loading { text-shadow:1px 1px 0 #fff; } .docviewer .inc-loading .bar { border:1px solid #999; background:#fff; } .docviewer .inc-loading .bar .progress { background-color:#ccc; } ';
    var a = document.createElement("style");
    a.type = "text/css";
    if (a.styleSheet) {
        a.styleSheet.cssText = b
    } else {
        a.appendChild(document.createTextNode(b))
    }
    document.getElementsByTagName("head")[0].appendChild(a)
})();