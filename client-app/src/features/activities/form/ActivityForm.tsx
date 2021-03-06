import React, { useState, useContext, useEffect } from 'react';
import { Segment, Form, Button, Grid } from 'semantic-ui-react';
import { ActivityFormValues } from '../../../app/models/activity';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';
import { Form as FinalForm, Field } from 'react-final-form';
import TextInput from '../../../app/common/TextInput';
import TextAreaInput from '../../../app/common/TextAreaInput';
import SelectInput from '../../../app/common/SelectInput';
import { category } from '../../../app/common/options/CategoryOptions';
import DateInput from '../../../app/common/DateInput';
import { CombinedDateAndTime } from '../../../app/common/util/util';
import uuid from 'uuid';
import {combineValidators, isRequired, composeValidators, hasLengthGreaterThan} from  'revalidate';

const validate = combineValidators({
  title: isRequired({message: 'The event title is required'}),
  category: isRequired('Category'),
  description: composeValidators (
    isRequired('Description'),
    hasLengthGreaterThan(4)({message: 'Description must be at least 5 characters'})
  )(),
  city: isRequired('City'),
  venue: isRequired('Venue'),
  date: isRequired('Date'),
  time: isRequired('Time')
})

interface DetailParams {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history
}) => {
  const activityStore = useContext(ActivityStore);
  const {
    createActivity,
    editActivity,
    submitting,
    loadActivity,
  } = activityStore;

  const [activity, setActivity] = useState(new ActivityFormValues());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (match.params.id) {
      setLoading(true);
      loadActivity(match.params.id).then(
        (activity) => setActivity(new ActivityFormValues(activity))
      ).finally(() => setLoading(false));
    }
  }, [
    loadActivity,
    match.params.id,
  ]);

  const handleFinalFormSubmit = (values: any) => {
    const dateAndTime = CombinedDateAndTime(values.date, values.time);
    const {date, time, ...activity} = values;
    activity.date = dateAndTime;
    if (!activity.id) {
      let newActivity = {
        ...activity,
        id: uuid()
      };
      createActivity(newActivity);
    } else {
      editActivity(activity);
    }
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <FinalForm
            validate={validate}
            initialValues={activity}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid, pristine }) => (
              <Form onSubmit={handleSubmit} loading={loading}>
                <Field
                  name="title"
                  placeholder="Title"
                  value={activity.title}
                  component={TextInput}
                />
                <Field
                  name="description"
                  placeholder="Description"
                  value={activity.description}
                  rows={3}
                  component={TextAreaInput}
                />
                <Field
                  name="category"
                  placeholder="Category"
                  value={activity.category}
                  options={category}
                  component={SelectInput}
                />
                <Form.Group widths="equal">
                  <Field
                    name="date"
                    type="datetime-local"
                    placeholder="Date"
                    value={activity.date}
                    component={DateInput}
                    date={true}
                  />
                  <Field
                    name="time"
                    time={true}
                    type="datetime-local"
                    placeholder="Time"
                    value={activity.date}
                    component={DateInput}
                  />
                </Form.Group>

                <Field
                  name="city"
                  placeholder="City"
                  value={activity.city}
                  component={TextInput}
                />
                <Field
                  name="venue"
                  placeholder="Venue"
                  value={activity.venue}
                  component={TextInput}
                />
                <Button
                  loading={submitting}
                  floated="right"
                  positive
                  type="submit"
                  content="Submit"
                  disabled={loading || invalid || pristine}
                />
                <Button
                  onClick={
                    activity.id 
                      ? () => history.push(`/activities/${activity.id}`)
                      : () => history.push('activities')}
                  floated="right"
                  type="button"
                  content="Cancel"
                  disabled={loading}
                />
              </Form>
            )}
          />
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityForm);
