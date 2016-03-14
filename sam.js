/*
{Element} viewRoot - receives element where snabbdom will create the views
{Object} model - initial values for the model
{Object} view - each function receives model and return h() call
{Object} action - each action can be parameterized, calls
{Function} - stateReturnView - receives model and state. returns view representation
{Function} - stateNextAction - receives model and state. invokes action in necessary
{Function} - modelPresent - receives data intent and model and applies intent to model
*/

function SAM(cfg, patch) {
  'use strict';

  function noop() {}

  var oldRepr = cfg.viewRoot;
  var model  = cfg.model  || {};
  var view   = cfg.view   || {};
  var state  = cfg.state  || {};
  var action = cfg.action || {};
  var stateReturnView = cfg.stateReturnView;
  var stateNextAction = cfg.stateNextAction || noop;

  function viewDisplay(repr) {
    oldRepr = patch(oldRepr, repr);
  }

  function stateRender(model) {
    viewDisplay( stateReturnView(model, state, view) );
    stateNextAction(model, state, action);
  }

  function modelPresent(data) {
    cfg.modelPresent(data, model, state);
    stateRender(model);
  }

  viewDisplay(view[cfg.initialView](model));

  window.action = action;
  window.modelPresent = modelPresent;
}

module.exports = SAM;
