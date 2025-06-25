import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, DollarSign, AlertTriangle, Eye, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  current_value?: number;
  risk_score?: number;
  last_analysis_date?: string;
  is_analyzed: boolean;
  property_type?: string;
  square_footage?: number;
}

interface PropertyListProps {
  properties: Property[];
  loading?: boolean;
  onPropertySelect?: (property: Property) => void;
  onAnalyzeProperty?: (propertyId: string) => void;
}

const PropertyList: React.FC<PropertyListProps> = ({
  properties,
  loading = false,
  onPropertySelect,
  onAnalyzeProperty
}) => {
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'value' | 'risk' | 'date'>('date');
  const [filterRisk, setFilterRisk] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  // Sort properties
  const sortedProperties = React.useMemo(() => {
    const filtered = properties.filter(property => {
      if (filterRisk === 'all') return true;
      const risk = property.risk_score || 0;
      if (filterRisk === 'low') return risk < 30;
      if (filterRisk === 'medium') return risk >= 30 && risk < 60;
      if (filterRisk === 'high') return risk >= 60;
      return true;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'value':
          return (b.current_value || 0) - (a.current_value || 0);
        case 'risk':
          return (b.risk_score || 0) - (a.risk_score || 0);
        case 'date':
          const dateA = a.last_analysis_date ? new Date(a.last_analysis_date) : new Date(0);
          const dateB = b.last_analysis_date ? new Date(b.last_analysis_date) : new Date(0);
          return dateB.getTime() - dateA.getTime();
        default:
          return 0;
      }
    });
  }, [properties, sortBy, filterRisk]);

  const getRiskColor = (riskScore: number) => {
    if (riskScore < 30) return 'text-green-600 bg-green-100';
    if (riskScore < 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getRiskLabel = (riskScore: number) => {
    if (riskScore < 30) return 'Low Risk';
    if (riskScore < 60) return 'Medium Risk';
    return 'High Risk';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-md animate-pulse">
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
              </div>
              <div className="w-16 h-8 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Sorting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">Sort by Date</option>
            <option value="value">Sort by Value</option>
            <option value="risk">Sort by Risk</option>
          </select>
          
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Risk Levels</option>
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
          </select>
        </div>
        
        <div className="text-sm text-gray-600">
          {sortedProperties.length} of {properties.length} properties
        </div>
      </div>

      {/* Property List */}
      <div className="space-y-4">
        <AnimatePresence>
          {sortedProperties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -2 }}
              className="bg-white rounded-lg p-6 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => {
                setSelectedProperty(property.id === selectedProperty ? null : property.id);
                onPropertySelect?.(property);
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {property.address}
                    </h3>
                    {property.property_type && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {property.property_type}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{property.city}, {property.state}</span>
                    {property.square_footage && (
                      <>
                        <span>•</span>
                        <span>{property.square_footage.toLocaleString()} sq ft</span>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    {property.current_value && (
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="font-semibold text-green-600">
                          ${property.current_value.toLocaleString()}
                        </span>
                      </div>
                    )}
                    
                    {property.last_analysis_date && (
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Analyzed {format(new Date(property.last_analysis_date), 'MMM d, yyyy')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* Risk Score */}
                  {property.risk_score !== undefined ? (
                    <div className="text-center">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        getRiskColor(property.risk_score)
                      }`}>
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        {Math.round(property.risk_score)}%
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {getRiskLabel(property.risk_score)}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                        Not Analyzed
                      </div>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPropertySelect?.(property);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    
                    {!property.is_analyzed && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAnalyzeProperty?.(property.id);
                        }}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Start Analysis"
                      >
                        <TrendingUp className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Expanded Details */}
              <AnimatePresence>
                {selectedProperty === property.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 pt-6 border-t border-gray-200"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Property Details</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div>Type: {property.property_type || 'Not specified'}</div>
                          <div>Size: {property.square_footage ? `${property.square_footage.toLocaleString()} sq ft` : 'Not specified'}</div>
                          <div>Status: {property.is_analyzed ? 'Analyzed' : 'Pending Analysis'}</div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Financial</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div>Current Value: {property.current_value ? `$${property.current_value.toLocaleString()}` : 'Not available'}</div>
                          <div>Risk Level: {property.risk_score ? getRiskLabel(property.risk_score) : 'Not assessed'}</div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Analysis</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div>Last Updated: {property.last_analysis_date ? format(new Date(property.last_analysis_date), 'MMM d, yyyy') : 'Never'}</div>
                          <div>Status: {property.is_analyzed ? 'Complete' : 'Pending'}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex space-x-3">
                      <button
                        onClick={() => onPropertySelect?.(property)}
                        className="btn-primary text-sm"
                      >
                        View Full Details
                      </button>
                      {!property.is_analyzed && (
                        <button
                          onClick={() => onAnalyzeProperty?.(property.id)}
                          className="btn-secondary text-sm"
                        >
                          Start Analysis
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {sortedProperties.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-gray-400 mb-4">
            <MapPin className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
          <p className="text-gray-600">
            {filterRisk !== 'all' 
              ? `No properties match the selected risk filter: ${filterRisk} risk`
              : 'Add some properties to get started with analysis'
            }
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default PropertyList;