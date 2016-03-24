function t(u) {
    chrome.tabs.create({url: u});
}

function gt() {
    chrome.tabs.query({}, function(tabs){
        $('#totalTabs').text(tabs.length);
    });
}

function gtt(id) {
    chrome.tabs.update(
        parseInt($(id).parent().parent().attr('id')),
        {
            active:true
        }
    );
}
function se(el) {
    if (el.is(':visible')) {
        el.slideUp();
    } else {
        el.slideDown();
    }
}

function eEnabled() {
    chrome.management.getAll(function(ext) {
        var t = ext.length,
            i = a = 0;
        for (; i<t; i++) {
            if (ext[i].enabled) {
                a++;
            }
        }
        $('#exT').text(t) && $('#exA').text(a);
    });
}

function ct(e) {
    var e = $(e),
        p = e.parent().parent(),
        i = p.attr('id');
    chrome.tabs.remove(parseInt(i));
    gt();
    $('#' + i).slideUp(function() {
        $(this).remove();
    });
}

function command(element) {
    var t = $(element),
        p = t.parent().parent(),
        i = p.attr('id'),
        a = t.text(),
        m = ['Enable','Disable','fade'];
    function set(id, b, text, v) {
        var x = $('#' + id).find($('.extAction'));
        x.hide(v[2],function() {
            function d(id, b, v, n, e) {
                e.text(v[n]).show(v[2],function() {
                    chrome.management.setEnabled(id,b);
                });
            }
            switch (text) {
                case v[0]:
                    d(id,b,v,1,x);
                    break;
                case v[1]:
                    d(id,b,v,0,x);
                    break;
            }
        });
    }
    switch (a) {
        case m[0]:
            set(i, true, m[0], m);
            break;
        case m[1]:
            set(i, false, m[1], m);
            break;
        case 'Uninstall':
            p.slideUp(function() {
                $(this).remove();
                chrome.management.uninstall(i);
            });
            break;
    }
}

eEnabled();
gt();
$('.extAppsTabTrigger').each(function() {
    $(this).click(function() {
        var o = $(this).attr('class');
        o = o.substr(-4);
        se($('#' + o));
    });
});

$('.extFooter .h').each(function() {
    $(this).click(function() {
        var page = $(this).attr('data-page');
        if (page) {
            t(page + '.html');
        }
    });
});


chrome.management.getAll(function(ext) {
    var t = ext.length,
        i = 0,
        im = s = '',
        gcem = /^Extensions Manager/,
        en,
        u = 'undefined',
        p = 'icon16.png',
        o = $('#tab1');

    for (; i<t; i++) {
        if (!gcem.test(ext[i].name) && (ext[i].mayDisable == true)) {
            if (typeof ext[i].icons != u) {
                if (typeof ext[i].icons[0].url != u) {
                    im = ext[i].icons[0].url;
                } else {
                    im = p;
                }
            } else {
                im = p;
            }
            if (ext[i].enabled == true) {
                s = 'Disable';
            } else {
                s = 'Enable';
            }
            en = ext[i].name.replace(/(<([^>]+)>)/ig,'');
            if (en.length > 40) {
                en = en.substr(0,30) + '...';
            }
            o.append('<div id="' + ext[i].id + '" class="exInCon cb"><img src="' + im + '" width="16" height="16" /><span class="exInNam">' + en + '</span> <span class="exInOp"><span class="h extAction" onclick="command(this);">' + s + '</span>&nbsp;<span class="d">&#183;</span>&nbsp;&nbsp;<span class="h extRemove" onclick="command(this);">Uninstall</span></span></div>');
        }
    }
    o.append('<div class="exInFot"><span class="h" onclick="t(\'chrome://extensions/\');">Show in default page</span></div><div class="cb"></div>');
});


chrome.tabs.query({},function(tabs) {
    var n = tabs.length,
        i = 0,
        f,
        t,
        p = /\.(ico|png|jpg|jpeg)$/i;

    for (; i<n; i++) {
        if ((typeof tabs[i].favIconUrl == 'undefined') || (!p.test(tabs[i].favIconUrl))){
            f = 'icon16.png';
        }else{
            f = tabs[i].favIconUrl;
        }
        t = tabs[i].title;
        if (t.length > 40) {
            t = t.substr(0,37) + '...';
        }
        $('#tab2').append('<div id="' + tabs[i].id + '" class="exInCon cb tabHover"><img src="' + f + '" width="16" height="16" /><span class="exInNam">' + t + '</span> <span class="exInOp"><span class="h">Select</span>&nbsp;<span class="d">&#183;</span>&nbsp;<span class="h extAction">Close</span></span></div>');
        $('.exInOp .h').on('click', function() {
            gtt($(this));
        });
        $('.extAction').on('click', function() {
            ct($(this));
        });
    }
});
