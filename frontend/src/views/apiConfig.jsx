import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Config = () => {
  const [triggerFields, setTriggerFields] = useState([]);
  const [friendFields, setFriendFields] = useState([]);
  const [selectedTriggerFields, setSelectedTriggerFields] = useState([]);
  const [selectedFriendFields, setSelectedFriendFields] = useState([]);
  const [isFieldsLoaded, setIsFieldsLoaded] = useState(false);
  const [notification, setNotification] = useState(null);
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000); // Hide notification after 5 seconds
  };

  const updateData = async () => {
    try {
      const token = localStorage.getItem("ACCESS_TOKEN");
      const response = await axios.post(
        "http://127.0.0.1:8000/api/client/fields/config",
        {
          field: selectedTriggerFields,
          support_field: selectedFriendFields
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log(response.data);
      showNotification("Configuration updated successfully!", "success");
    } catch (error) {
      console.error("Error updating fields:", error.response ? error.response.data : error.message);
      showNotification("Error updating configuration. Please try again.", "error");
    }
  };
  
  useEffect(() => {
    const token = localStorage.getItem("ACCESS_TOKEN");

    const fetchFields = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/client/list/fields", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const uniqueFields = Array.from(new Set(response.data.fields));
        setTriggerFields(uniqueFields);
        setFriendFields(uniqueFields);
      } catch (error) {
        console.error("Error fetching fields data:", error);
      }
    };

    const getTriggerAndFriendFields = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/client/list/trigger/fields", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSelectedTriggerFields(response.data.triggerFields || []);
        setSelectedFriendFields(response.data.friendFields || []);
        setIsFieldsLoaded(true);
      } catch (error) {
        console.error("Error fetching trigger and friend fields data:", error);
      }
    };

    const fetchData = async () => {
      await getTriggerAndFriendFields();
      await fetchFields();
    };

    fetchData();
  }, []);

  const handleSelectChange = (event, currentSelected, setSelected) => {
    const value = event.target.value;
    setSelected(
      event.target.checked
        ? [...currentSelected, value]
        : currentSelected.filter((field) => field !== value)
    );
  };

  const FieldSelector = ({ title, fields, selectedFields, setSelectedFields }) => (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {fields.map((field, index) => (
          <label key={index} className="inline-flex items-center">
            <input
              type="checkbox"
              value={field}
              checked={selectedFields.includes(field)}
              onChange={(e) => handleSelectChange(e, selectedFields, setSelectedFields)}
              className="form-checkbox h-5 w-5 text-blue-600 rounded"
            />
            <span className="ml-2 text-gray-700 text-sm">{field}</span>
          </label>
        ))}
      </div>
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Fields:</h4>
        <div className="flex flex-wrap gap-2">
          {selectedFields.map((value, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {value}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
  const Notification = ({ message, type }) => (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md text-white ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} z-50 shadow-lg`}>
      {message}
    </div>
  );
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen relative">
      {notification && <Notification message={notification.message} type={notification.type} />}
      
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Field Configuration</h2>
      
      <FieldSelector 
        title="Trigger Fields" 
        fields={triggerFields} 
        selectedFields={selectedTriggerFields} 
        setSelectedFields={setSelectedTriggerFields}
      />
      
      <FieldSelector 
        title="Support Fields" 
        fields={friendFields} 
        selectedFields={selectedFriendFields} 
        setSelectedFields={setSelectedFriendFields}
      />
      
      <button 
        onClick={updateData}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Update API Configuration
      </button>
    </div>
  );
};


export default Config;