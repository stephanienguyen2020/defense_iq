import React, { useState } from 'react';

const [selectedConcern, setSelectedConcern] = useState<string | null>(null);
const [showZoneAnswer, setShowZoneAnswer] = useState(false);
const [showConcernAnswer, setShowConcernAnswer] = useState(false);

// Function to handle concern selection and reveal the answer
const handleConcernSelect = (concern: string) => {
  setSelectedConcern(concern);
  setShowConcernAnswer(true);
};

const [activeZoneArea, setActiveZoneArea] = useState<string | null>(null); 