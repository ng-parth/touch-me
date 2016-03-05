/**
 * Created by Parth on 06/03/16.
 */
document.head.insertAdjacentHTML( 'beforeEnd', '<meta name="viewport" content="target-densitydpi=device-dpi,width=device-width,initial-scale=1.0" />' );

$(function(){
    //initialization
    $(".detector").bind("click touchstart",function(e){
        $(".detector").removeClass("selected");
        $(this).addClass("selected");

        unbindLibrary();
        bindLibrary($(this).prop("id"));
    });

    //bind library to gesture pad
    bindLibrary = function(id){
        var $pad = $("#gesture-pad");
        var events = [];
        var eventStr = "";
        $("#" + id + "List li").each(function(){
            events.push($(this).text());
        })
        //make target event list from each library's gestureList
        eventStr = events.join(" ");

        switch(id){
            case "hammer":
                hammer = Hammer($pad.get(0), {
                    prevent_default: true
                })
                    .on(eventStr, logEvent);
                break;
            case "quojs":
                for(var i = 0;i<events.length;i++){
                    $$("#gesture-pad").on(events[i], logEvent);
                }
                $$("#gesture-pad").on("touchstart",function(e){
                    e.preventDefault();
                });
                break;
            case "touchSwipe":
                var options = {};
                var touchSwipeHandler = function(name){
                    if(name.indexOf("pinch") < 0){
                        return function(event, distance, duration, fingerCount){
                            var e = {}; e["type"] = name; logEvent(e);
                        };
                    }else{
                        return function(e, direction, distance, d, f, pinchZoom){
                            var e = {}; e["type"] = name; logEvent(e);
                        };
                    }
                };

                for(var i = 0;i<events.length;i++){
                    options[events[i]] = new touchSwipeHandler(events[i]);
                }
                $pad.swipe(options);
                break;
            case "touchy" :
                var handler = function(name){
                    return function(event, phase, $target, data){
                        var e = {}; e["type"] = name; logEvent(e);
                    }
                }
                for(var i = 0;i<events.length;i++){
                    $pad.bind(events[i],new handler(events[i]));
                }
                break;
        }
    }

    //unbind library from gesture pad
    unbindLibrary = function(){
        var element = $("#gesture-pad").clone();
        $("#gesture-pad").replaceWith(element);
        $(".gesturelist .selected").removeClass("selected");
    }

    //log detected gesture
    logEvent = function(e){
        $("#detected").text(e.type);
        var selected = $(".detector.selected").prop("id");
        $("#" + selected + "List li").each(function(){
            if($(this).text() == e.type){
                $(this).addClass("selected");
            };
        })
        return false;
    }

    $(".detector").first().addClass("selected");
    bindLibrary($(".detector.selected").prop("id"));

})
