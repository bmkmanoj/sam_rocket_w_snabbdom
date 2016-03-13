function PROGRAM(patch, h) {
    'use strict';
    
    // auxiliary constants
    var COUNTER_MAX = 10;
    var VIEW_ROOT = document.getElementById('representation');
    
    // will be set up by a closure which will privately hold the model
    var modelPresent; 
    
    
    
    // VIEW
    //
    // each view is a pure function of the model
    // views can trigger actions via user-generated events (ie: a click)
    
    // each view should return the relevant structure for the view render abstraction you're using. snabbdom is used here
    var view = {
        init: function(model) { // by convention, at bootstrap this view will be used
            return view.ready(model);
        },
        ready: function(model) {
            return h('div', [
                'Counter: ',
                model.counter,
                h('br'),
                h('button', {on:{click:function() { action.start(); }}}, 'Start')
            ]);
        },
        counting: function(model) {
            return h('div', [
                'Count down: ',
                model.counter,
                h('br'),
                h('button', {on:{click:function() { action.abort(); }}}, 'Abort')
            ]);
        },
        aborted: function(model) {
            return h('div', [
                'Aborted at Counter: ',
                model.counter
            ]);
        },
        launched: function(model) {
            return h('div', 'Launched');
        }
    };
    
    // root DOM element where views will live
    var oldRepr = VIEW_ROOT;
    
    // viewDisplay implementation is determined by how you want to render views. I'm using snabbdom here
    function viewDisplay(repr) {
        oldRepr = patch(oldRepr, repr);
    }
    
    
    
    // ACTION
    //
    // actions are invoked by either user-generated events or fired by the app on state creteria being reached
    // actions can be parameterized (see decrement).
    // action can be asynchronous (see decrement).
    // an action can be silently ignored if validation criteria fails
    // if action isn't invalid, should invoke modelPresent, passing on the intent object
    
    var action = {
        start: function() {
            modelPresent({started:true});
        },
        decrement: function(data) {
            setTimeout(function() {
                --data.counter;
                modelPresent(data);
            }, 1000);
        },
        launch: function() {
            modelPresent({launched:true});
        },
        abort: function() {
            modelPresent({aborted:true});
        }
    };
    
    
    
    // STATE
    // provides predicates to allow model to reason with (as in state machine states)
    // should, via stateRender:
    // * elect how to render a view from the model (stateRepresentation)
    // * fire any auto-invoked action, if model criteria requires so (stateNextAction)
    
    // relevant predicates based on the model
    var state = {
        ready: function(model) {
            return (
                (model.counter === COUNTER_MAX) &&
                !model.started &&
                !model.launched &&
                !model.aborted
            );
        },
        counting: function(model) {
            return (
                (model.counter <= COUNTER_MAX) &&
                (model.counter >= 0) &&
                model.started &&
                !model.launched &&
                !model.aborted
            );
        },
        launched: function(model) {
            return (
                (model.counter == 0) &&
                model.started &&
                model.launched &&
                !model.aborted
            );
        },
        aborted: function(model) {
            return (
                (model.counter <= COUNTER_MAX) &&
                (model.counter >= 0) &&
                model.started &&
                !model.launched &&
                model.aborted
            );
        }
    };
    
    function stateRender(model) {
        // 1) how to represent the model as a view
        var repr;

        if (state.ready(model)) {
            repr = view.ready(model);
        }
        else if (state.counting(model)) {
            repr = view.counting(model);
        }
        else if (state.launched(model)) {
            repr = view.launched(model);
        }
        else if (state.aborted(model)) {
            repr = view.aborted(model);
        }
        else {
            repr = 'oops... something went wrong, the system is in an invalid state';
        }

        viewDisplay(repr);
        
        
        // 2) which actions to automatically trigger, based on the model (if any...)
        if (state.counting(model)) {
            if (model.counter === 0) {
                action.launch();
            }
            else if (model.counter > 0) {
                action.decrement({counter:model.counter});
            }
        }
    }
    
    
    
    // MODEL
    //
    // the object shouldn't be affacted directly (so hoistered on an IIFE)
    // exposes modelPresent fn, receiving the data resulting from calling an action.
    // the fn can ignore the data if its integrity is compromised.
    // otherwise, fn will pass model to stateRender function (which should just READ it)
    (function() {        
        var model = {
            counter  : COUNTER_MAX,
            started  : false,
            launched : false,
            aborted  : false
        };
        
        modelPresent = function(data) {
            // process action intent data into model changes, if valid
            // all model CHANGES should occurr only here
            if (state.counting(model)) {
                if (model.counter === 0) {
                    model.launched = !!data.launched;
                }
                else {
                    model.aborted = !!data.aborted;
                    if ('counter' in data && !isNaN(data.counter)) {
                        model.counter = data.counter;
                    }
                }
            }
            else {
                if (state.ready(model)) {
                    model.started = !!data.started;
                }
            }
            
            // elect how to represent the model to the view and trigger any auto-invoked actions
            stateRender(model);
        };
    
        // display initial state
        viewDisplay(view.init(model));
    })();
    
}
