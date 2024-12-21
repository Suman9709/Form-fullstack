import React from 'react';  // No need for async here
import Navbar from './Navbar';
import AllFeedback from './AllFeedback';

const AdminHomepage = () => {
  return (
    <div>
        <Navbar showBatchSelect={true} />

        {/* List for the feedback of the student */}
        <AllFeedback />
    </div>
  );
};

export default AdminHomepage;
