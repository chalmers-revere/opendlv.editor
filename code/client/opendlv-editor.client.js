/**
 * Copyright (C) 2017 Ola Benderius
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

$(document).ready(function() {

  $.ajax({
    url: 'http://localhost:8080/ajax?request=getlayers',
    dataType: 'json',
    cache: false,
    timeout: 5000,
    success: function(data) {
      renderLayers(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert('error ' + textStatus + ' ' + errorThrown);
    }
  });

  $('#layer-form').on('submit', function(e) {
    e.preventDefault();
    var now = new Date();
    const layer = {
      'open' : $('input[name=layer-open]:checked').val(), 
      'name' : $('#layer-name').val(),
      'year' : now.getFullYear(),
      'baseimage' : {
        'name' : $('#layer-baseimage-name').val(),
        'version' : $('#layer-baseimage-version').val()
      }
    };
    const layerData = JSON.stringify(layer);

    $.ajax({
      url: 'http://localhost:8080/ajax?request=createlayer&data=' + layerData,
      dataType: 'json',
      cache: false,
      timeout: 5000,
      success: function(data) {
        alert(JSON.stringify(data, null, 2));
      },
      error: function(jqXHR, textStatus, errorThrown) {
        alert('error ' + textStatus + ' ' + errorThrown);
      }
    });
  }); 
  
  
  
  $('#namespace-form').on('submit', function(e) {
    e.preventDefault();
    var now = new Date();
    const layer = {
      "layer" : $('#namespace-layer').val(),
      "year" : now.getFullYear(),
      "namespace" : $('#namespace-name').val()
    };
    const layerData = JSON.stringify(layer);

    $.ajax({
      url: 'http://localhost:8080/ajax?request=createlayer&data=' + layerData,
      dataType: 'json',
      cache: false,
      timeout: 5000,
      success: function(data) {
        alert(JSON.stringify(data, null, 2));
      },
      error: function(jqXHR, textStatus, errorThrown) {
        alert('error ' + textStatus + ' ' + errorThrown);
      }
    });
  }); 


});

function renderLayerComponent(widthPercent, color, label, childContent) {
  const layerHtml = '<div style="width: ' + widthPercent + '%; height: 100%; display: flex; flex-direction: column; float: left;"><div style="width: 100%; background-color: white; flex-shrink: 0; flex-grow: 1;">' + childContent + '</div><div style="text-align: center; border: solid 1px black; width: 100%; height: 60px; background-color: ' + color + '; flex-shrink: 0;"><p>' + label + '</p></div></div>';
  return layerHtml;
}

function renderLayerBoundingBox(content) {
  const layerHtml = '<div style="width: 100%; height: 100%; float: left;">' + content + '</div><br style="clear: left;">';
  return layerHtml;
}

function renderLayerTreeWithBase(layer, unknownLayers, widthPercent) {
  const name = layer['name'];
  const image = layer['image'];
  var childLayers = [];

  for (const key in unknownLayers) {
    const unknownLayer = unknownLayers[key];
    if (layer == unknownLayer) {
      continue;
    }

    const fullBaseImage = unknownLayer['base_image'];
    const baseImage = fullBaseImage.substr(fullBaseImage.indexOf('/') + 1);

    if (image == baseImage) {
      childLayers.push(unknownLayer);
    }
  }
  
  var childLayersHtml = '';

  const childLayerCount = Object.keys(childLayers).length;
  if (childLayerCount != 0) {
    const childWidthPercent = Math.round(100 / childLayerCount);
    for (const key in childLayers) {
      const childLayer = childLayers[key];
      const childLayerHtml = renderLayerTreeWithBase(childLayer, unknownLayers,
        childWidthPercent);
      childLayersHtml += childLayerHtml;
    }
  }

  const html = renderLayerComponent(widthPercent, 'mediumseagreen', name, 
    childLayersHtml);
   
  return html;
}

function renderLayers(json) {

  const layers = json['layers'];

  var baseLayers = [];
  var unknownLayers = [];

  for (const key in layers) {
    const layer = layers[key];
    const fullBaseImage = layer['base_image'];
    const baseImage = fullBaseImage.substr(fullBaseImage.indexOf('/') + 1);
    var isBaseLayer = true;
    for (const key2 in layers) {
      if (key == key2) {
        continue;
      }
      const layer2 = layers[key2];
      const image2 = layer2['image'];
      if (baseImage == image2) {
        isBaseLayer = false;
        break;
      }
    }

    if (isBaseLayer) {
      baseLayers.push(layer);
    } else {
      unknownLayers.push(layer);
    }
  }

  const baseLayerCount = Object.keys(baseLayers).length;
  if (baseLayerCount != 0) {
    const baseLayerWidth = Math.round(100 / baseLayerCount);

    var baseLayersHtml = '';
    for (const key in baseLayers) {
      const baseLayer = baseLayers[key];
      const baseLayerName = baseLayer['name'];
      const baseLayerBaseImage = baseLayer['base_image'];
      const baseLayerHtml = renderLayerTreeWithBase(baseLayer, unknownLayers, 
        baseLayerWidth);
  
      baseLayersHtml += renderLayerComponent(baseLayerWidth, 'lightcyan', 
        baseLayerBaseImage, baseLayerHtml);
    }

    const layersHtml = renderLayerBoundingBox(baseLayersHtml);

    $('#layers').append(layersHtml);
  }
}
