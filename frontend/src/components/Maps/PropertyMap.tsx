import React, { useState, useCallback, useMemo } from 'react';
import Map, { Marker, Popup, NavigationControl, FullscreenControl, ScaleControl } from 'react-map-gl';
import { motion, AnimatePresence } from 'framer-motion';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Property {
  id: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  current_value?: number;
  risk_score?: number;
  property_type?: string;
}

interface PropertyMapProps {
  properties: Property[];
  selectedProperty?: Property;
  onPropertySelect?: (property: Property) => void;
  className?: string;
  mapStyle?: string;
  showHeatmap?: boolean;
}

const PropertyMap: React.FC<PropertyMapProps> = ({
  properties,
  selectedProperty,
  onPropertySelect,
  className = "",
  mapStyle = "mapbox://styles/mapbox/satellite-streets-v12",
  showHeatmap = false
}) => {
  const [viewState, setViewState] = useState({
    longitude: selectedProperty?.longitude || -74.5,
    latitude: selectedProperty?.latitude || 40,
    zoom: 12
  });
  const [selectedMarker, setSelectedMarker] = useState<Property | null>(null);
  const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null);
  
  // Calculate map bounds if multiple properties
  const bounds = useMemo(() => {
    if (properties.length === 0) return null;
    
    const lngs = properties.map(p => p.longitude);
    const lats = properties.map(p => p.latitude);
    
    return {
      west: Math.min(...lngs),
      east: Math.max(...lngs),
      south: Math.min(...lats),
      north: Math.max(...lats)
    };
  }, [properties]);
  
  // Determine marker color based on risk score
  const getMarkerColor = useCallback((property: Property) => {
    const riskScore = property.risk_score || 0;
    if (riskScore < 30) return '#10B981'; // Green
    if (riskScore < 60) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  }, []);
  
  // Determine marker size based on property value
  const getMarkerSize = useCallback((property: Property) => {
    const value = property.current_value || 0;
    if (value > 1000000) return 40;
    if (value > 500000) return 30;
    return 20;
  }, []);
  
  const handleMarkerClick = useCallback((property: Property) => {
    setSelectedMarker(property);
    onPropertySelect?.(property);
    
    // Animate to property location
    setViewState(prev => ({
      ...prev,
      longitude: property.longitude,
      latitude: property.latitude,
      zoom: 16,
      transitionDuration: 1000
    }));
  }, [onPropertySelect]);
  
  return (
    <motion.div 
      className={`relative ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full h-full rounded-xl overflow-hidden shadow-lg">
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          mapStyle={mapStyle}
          mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          style={{ width: '100%', height: '100%' }}
          maxZoom={20}
          minZoom={8}
        >
          {/* Property Markers */}
          {properties.map((property) => (
            <Marker
              key={property.id}
              longitude={property.longitude}
              latitude={property.latitude}
              anchor="bottom"
            >
              <motion.div
                className="relative cursor-pointer"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onHoverStart={() => setHoveredProperty(property)}
                onHoverEnd={() => setHoveredProperty(null)}
                onClick={() => handleMarkerClick(property)}
              >
                {/* Pulse animation for selected property */}
                {selectedProperty?.id === property.id && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      backgroundColor: getMarkerColor(property),
                      opacity: 0.3
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 0, 0.3]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
                
                {/* Main marker */}
                <div
                  className="rounded-full border-2 border-white shadow-lg flex items-center justify-center"
                  style={{
                    backgroundColor: getMarkerColor(property),
                    width: getMarkerSize(property),
                    height: getMarkerSize(property)
                  }}
                >
                  <span className="text-white text-xs font-bold">
                    {property.property_type === 'commercial' ? '🏢' : '🏠'}
                  </span>
                </div>
                
                {/* Risk indicator */}
                {property.risk_score && property.risk_score > 70 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white">
                    <div className="w-full h-full bg-red-500 rounded-full animate-ping" />
                  </div>
                )}
              </motion.div>
            </Marker>
          ))}
          
          {/* Hover Popup */}
          <AnimatePresence>
            {hoveredProperty && (
              <Popup
                longitude={hoveredProperty.longitude}
                latitude={hoveredProperty.latitude}
                closeButton={false}
                closeOnClick={false}
                className="property-popup"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="p-3 min-w-[200px]"
                >
                  <div className="font-semibold text-gray-900 mb-1">
                    {hoveredProperty.address}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {hoveredProperty.city}, {hoveredProperty.state}
                  </div>
                  
                  {hoveredProperty.current_value && (
                    <div className="text-sm font-medium text-green-600 mb-1">
                      ${hoveredProperty.current_value.toLocaleString()}
                    </div>
                  )}
                  
                  {hoveredProperty.risk_score && (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Risk:</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${hoveredProperty.risk_score}%`,
                            backgroundColor: getMarkerColor(hoveredProperty)
                          }}
                        />
                      </div>
                      <span className="text-xs font-medium">
                        {Math.round(hoveredProperty.risk_score)}%
                      </span>
                    </div>
                  )}
                </motion.div>
              </Popup>
            )}
          </AnimatePresence>
          
          {/* Selected Property Popup */}
          {selectedMarker && (
            <Popup
              longitude={selectedMarker.longitude}
              latitude={selectedMarker.latitude}
              onClose={() => setSelectedMarker(null)}
              className="selected-property-popup"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 min-w-[250px]"
              >
                <div className="font-bold text-gray-900 mb-2">
                  {selectedMarker.address}
                </div>
                <div className="text-gray-600 mb-3">
                  {selectedMarker.city}, {selectedMarker.state}
                </div>
                
                <div className="space-y-2">
                  {selectedMarker.current_value && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Value:</span>
                      <span className="font-semibold text-green-600">
                        ${selectedMarker.current_value.toLocaleString()}
                      </span>
                    </div>
                  )}
                  
                  {selectedMarker.risk_score && (
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Risk Score:</span>
                        <span className="font-semibold">
                          {Math.round(selectedMarker.risk_score)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${selectedMarker.risk_score}%`,
                            backgroundColor: getMarkerColor(selectedMarker)
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => onPropertySelect?.(selectedMarker)}
                  className="w-full mt-3 bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  View Details
                </button>
              </motion.div>
            </Popup>
          )}
          
          {/* Map Controls */}
          <NavigationControl position="top-right" />
          <FullscreenControl position="top-right" />
          <ScaleControl position="bottom-left" />
        </Map>
      </div>
      
      {/* Map Legend */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-3 shadow-lg"
      >
        <div className="text-sm font-semibold text-gray-900 mb-2">Risk Levels</div>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs text-gray-700">Low Risk (< 30%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-xs text-gray-700">Medium Risk (30-60%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-xs text-gray-700">High Risk (> 60%)</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PropertyMap;