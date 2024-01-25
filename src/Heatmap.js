import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat/dist/leaflet-heat.js';
import L from 'leaflet';

const GRADIENT = {          // Gradient colors for the heatmap
  0.4: 'blue',
  0.6: 'cyan',
  0.7: 'lime',
  0.8: 'yellow',
  1.0: 'red'
};

const reversedGradient = {
  0.4: 'red',
  0.6: 'yellow',
  0.7: 'lime',
  0.8: 'cyan',
  1.0: 'green'
}

function gradientColor(value) {
    // Ensure the input value is within the range [0, 1]
    value = Math.max(0, Math.min(1, value));

    // Define the RGB values for the start (red) and end (green) colors
    var startColor = [255, 0, 0]; // Blue
    var endColor = [0, 255, 0];   // Green

    // Interpolate between the start and end colors based on the input value
    var interpolatedColor = [
        Math.round(startColor[0] * (1 - value) + endColor[0] * value),
        Math.round(startColor[1] * (1 - value) + endColor[1] * value),
        Math.round(startColor[2] * (1 - value) + endColor[2] * value)
    ];

    // Return the RGB string for CSS
    return 'rgb(' + interpolatedColor.join(',') + ')';
}

function getColor(value) {
  
  const colorMap = reversedGradient;
  const keys = Object.keys(colorMap);
  let closestKey = keys.reduce((a, b) => Math.abs(b - value) < Math.abs(a - value) ? b : a);

  return colorMap[closestKey];
}

const HeatmapLayer = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (points && points.length > 0) {
      const heatLayer = L.heatLayer(points).addTo(map);
      return () => map.removeLayer(heatLayer);
    }
  }, [map, points]);

  return null;
};

const CirclesLayer = ({ circles }) => {
  return (
    <>
      {circles.map((circle, index) => (
        <Circle
          key={index}
          center={circle.center}
          radius={circle.radius}
          pathOptions={{ color: gradientColor(circle.indexValue), fillColor: getColor(circle.indexValue) }}  // Customize the circle color
        >
          <Popup>{circle.popupContent}</Popup>
        </Circle>
      ))}
    </>
  );
};


const Heatmap = ({ center, zoom, points, circles }) => {
  const heatmapOptions = {
    radius: 14,          // Radius of each data point
    blur: 30,            // Blur radius (higher values create smoother heatmap)
    maxZoom: 17,         // Maximum zoom level for the heatmap
    gradient: GRADIENT,
    maxOpacity: 2,     // Maximum opacity of the heatmap
    minOpacity: 0.5      // Minimum opacity of the heatmap
  };
  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '700px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <HeatmapLayer points={points} options={heatmapOptions}/>
      {circles && <CirclesLayer circles={circles} />}
    </MapContainer>
  );
};

export default Heatmap;
