'use strict';

define(['jquery'], function($) {
  var API_BASE_URL = '/* @echo API_URL */';
  var fieldSelector = '';
  var intervalTime = 1000;
  var isSaving = false;
  var scope;
  var params;
  var iep;

  function status(response) {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(new Error(response.statusText));
    }
  }

  function json(response) {
    return response.json();
  }

  var queryString = function() {
    var queryString = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");

      if (typeof queryString[pair[0]] === "undefined") {
        queryString[pair[0]] = decodeURIComponent(pair[1]);
      } else if (typeof queryString[pair[0]] === "string") {
        var arr = [queryString[pair[0]], decodeURIComponent(pair[1])];
        queryString[pair[1]] = arr;
      } else {
        queryString[pair[0]].push(decodeURIComponent(pair[1]));
      }
    }

    return queryString;
  }

  var shouldBeReadOnly = function() {
    if (typeof iep.id === 'undefined') {
      console.log('iep.id is undefined');
      return true;
    }

    if (iep.activated_at && iep.is_active === "0") {
      console.log('is has been activated but is no longer active');
      return true;
    }

    if (iep.activated_at) {
      var now = new Date();
      var expires = new Date(iep.activated_at);
      expires.setYear(expires.getFullYear() + 1); // add a year
      expires.setDate(expires.getDate() - 1); // minus a day

      if (now.getTime() > expires.getTime()) {
        console.log('this IEP has expired');
        return true;
      }
    }

    if (params.iepResponse !== "") {
      var responseIdBelongs = false;
      for (var i = 0; i < iep.iep_response.length; i++) {
        if (params.responseid == iep.iep_response[i].u_fb_form_response_id) {
          responseIdBelongs = true;
        }
      }

      if (!responseIdBelongs) {
        console.log('does not belong');
        return true;
      }
    }

    return false;
  }

  var setFormToReadOnly = function() {
    $('input').prop('disabled', true);
    $('select').prop('disabled', true);
    $('textarea').prop('disabled', true);
    $('.form-footer .dropup.jumpto').remove();

    setTimeout(setFormToReadOnly, 1500);
  }

  var responseUpdated = function(oldId, newId, newScope) {
    if (oldId !== newId && newId && newId !== "") {
      params.iepResponse = newScope.formContent.response.id;
      params.responseid = newScope.formContent.response.id;

      window.fetch(API_BASE_URL + 'iep/attach', {
        method: 'POST',
        body: JSON.stringify({
          frn: params.frn,
          iep: params.iep,
          responseid: params.responseid,
          userdcid: userdcid
        })
      }).then(status)
        .then(function() {
          var urlParams = [
            'formid=' + params.formid,
            'type=' + params.type,
            'responseid=' + params.responseid,
            'iep=' + params.iep,
            'frn=' + params.frn
          ];
          window.location.replace('/admin/formbuilder/students/studentform.html?' + urlParams.join('&'));
        });
    }
  }

  function init() {
    var urlParams = ['iep=' + params.iep, 'frn=' + params.frn];
    window.fetch(API_BASE_URL + 'iep/data?' + urlParams.join('&'))
      .then(status)
      .then(json)
      .then(function(response) {
        iep = response;
        console.log(iep);
        if (shouldBeReadOnly()) {
          setFormToReadOnly();
        }

        if (scope.formContent.title === "IEP: SpEd 51") {
          fieldSelector = '.pdf_sped-teacher';
          watchSubmit();
        }

        if (scope.formContent.title === "IEP: SpEd 6a1") {
          fieldSelector = '.pdf_date';
          watchSubmit();
        }
      });
  }

  function watchSubmit() {
    if ($('#alert_msg').is(':visible') && !isSaving) {
      isSaving = true;
      var body = {
        frn: params.frn,
        iep: iep.id,
        field: fieldSelector,
        value: getResponseValue(fieldSelector.substring(1))
      };
      console.log(body);

      window.fetch(API_BASE_URL + 'iep/update', {
        method: 'post',
        body: JSON.stringify(body)
      }).then(function() {
          isSaving = false;
        });
    }

    setTimeout(watchSubmit, 4000);
  }

  function getResponseValue(className) {
    for (var i = 0; i < scope.formContent.originalElements.length; i++) {
      if (scope.formContent.originalElements[i].class == className) {
        return scope.formContent.originalElements[i].response;
      }
    }
  }

  function readyForm() {
    removeCogWheel();
    removeJumpToBtn();
  }

  function removeJumpToBtn() {
    if ($('#formcontainer .form-footer button.dropdown-toggle').length > 0) {
      $('#formcontainer .form-footer button.dropdown-toggle').remove();
      $('#formcontainer .btn-group').removeClass('btn-group');
      intervalTime = 10000;
    }

    setTimeout(removeJumpToBtn, intervalTime);
  }

  function removeCogWheel() {
    if ($('#formcontainer .formaction.glyphicon.glyphicon-cog').length > 0) {
      $('#formcontainer .formaction.glyphicon.glyphicon-cog').remove();
      intervalTime = 10000;
    }

    setTimeout(removeCogWheel, intervalTime);
  }

  angular.element(document).ready(function() {
    scope = angular.element(document).scope();
    params = {
      formid: queryString().formid,
      type: queryString().type,
      iep: queryString().iep,
      iepResponse: queryString().responseid,
      responseid: scope.formContent.response.id,
      frn: queryString().frn,
      subjectid: scope.formParams.subjectid
    };

    if (params.iepResponse === "") {
      if (scope.formContent.archive == "grade_level" && scope.formContent.response.id !== "") {
        scope.formContent.archive = "force";
        scope.$digest();
      }

      scope.$watch('formContent.response.id', responseUpdated);
    }
  });


  $(document).ready(function() {
    init();
    readyForm();
  });

  return function() {}
});
