var snabbdom = require('snabbdom');

var patch = snabbdom.init([                   // Init patch function with choosen modules
  require('snabbdom/modules/class'),          // makes it easy to toggle classes
  require('snabbdom/modules/props'),          // for setting properties on DOM elements
  require('snabbdom/modules/style'),          // handles styling on elements with support for animations
  require('snabbdom/modules/eventlisteners'), // attaches event listeners
]);

var h = require('snabbdom/h');

var SAM = require('./sam');



var COUNTER_MAX = 10;

SAM({
  state: {
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
  },
  stateReturnView: function(model, state, view) {
    if (state.ready(model)) {
      return view.ready(model);
    }
    if (state.counting(model)) {
      return view.counting(model);
    }
    if (state.launched(model)) {
      return view.launched(model);
    }
    if (state.aborted(model)) {
      return view.aborted(model);
    }
    return 'oops... something went wrong, the system is in an invalid state';
  },
  stateNextAction: function(model, state, action) {
    if (state.counting(model)) {
      if (model.counter === 0) {
        action.launch();
      }
      else if (model.counter > 0) {
        action.decrement({counter:model.counter});
      }
    }
  },

  action: {
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
  },

  model: {
    counter  : COUNTER_MAX,
    started  : false,
    launched : false,
    aborted  : false
  },
  modelPresent: function(data, model, state) {
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
  },

  viewRoot: document.querySelector('#representation'),
  initialView: 'ready',
  view: {
    ready: function(model, state) {
      return h('div', [
        'Counter: ',
        model.counter,
        h('br'),
        h('button', {on:{click:function() { action.start(); }}}, 'Start')
      ]);
    },
    counting: function(model, state) {
      return h('div', [
        'Count down: ',
        model.counter,
        h('br'),
        h('button', {on:{click:function() { action.abort(); }}}, 'Abort')
      ]);
    },
    aborted: function(model, state) {
      return h('div', [
        'Aborted at Counter: ',
        model.counter
      ]);
    },
    launched: function(model, state) {
      return h('div', 'Launched');
    }
  }
}, patch);
