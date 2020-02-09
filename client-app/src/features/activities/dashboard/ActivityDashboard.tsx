import React from 'react';
import { Grid } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import ActivityList from './ActivityList';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';

interface IProps {
    activities: IActivity[];
    selectActivity: (id: string) => void;
    selectedActivity: IActivity | null;
    editMode: boolean;
    setEditMode: (editMode: boolean) => void;
    setSelectedActivity: (activity: IActivity | null) => void;
    createActivity: (activity: IActivity) => void;
    editActivity: (activity: IActivity) => void;
    deleteActivity: (id: string) => void;
}

const ActivityDashboard: React.FC<IProps> = ({
  activities, 
  createActivity,
  deleteActivity,
  editActivity,
  selectActivity, 
  selectedActivity,
  setSelectedActivity,
  editMode,
  setEditMode}) => {

  return (
    <Grid>
      <Grid.Column width={10}>
          <ActivityList activities={activities} selectActivity={selectActivity} deleteActivity={deleteActivity}></ActivityList>
      </Grid.Column>
      <Grid.Column width={6}>        
        {selectedActivity && !editMode && (
          <ActivityDetails 
            setSelectedActivity={setSelectedActivity} 
            activity={selectedActivity} 
            setEditMode={setEditMode}></ActivityDetails>)}
        {editMode && (
          <ActivityForm 
            key={(selectedActivity && selectedActivity.id) || 0}
            setEditMode={setEditMode}
            activity={selectedActivity!}
            createActivity={createActivity}
            editActivity={editActivity}></ActivityForm>)}
      </Grid.Column>
    </Grid>
  );
};

export default ActivityDashboard;
