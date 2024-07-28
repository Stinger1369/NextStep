// src/pages/activities/CreateActivity/ReviewAndSubmit.tsx
import React from 'react';
import { useFormikContext } from 'formik';
import { IActivity } from '../../../../types';
import './ReviewAndSubmit.css';

const ReviewAndSubmit: React.FC = () => {
  const { values, handleSubmit } = useFormikContext<IActivity>();

  return (
    <div className="review-submit-container">
      <div className="card review-submit-card">
        <div className="card-header">Review and Submit</div>
        <div className="card-body">
          <h4>Activity Details</h4>
          <p>
            <strong>Title:</strong> {values.title}
          </p>
          <p>
            <strong>Description:</strong> {values.description}
          </p>
          <p>
            <strong>Date:</strong> {values.date}
          </p>
          <p>
            <strong>Start Time:</strong> {values.startTime.hour}:{values.startTime.minute}
          </p>
          <p>
            <strong>End Time:</strong> {values.endTime.hour}:{values.endTime.minute}
          </p>
          <p>
            <strong>Location:</strong> {values.location.address}
          </p>
          <p>
            <strong>Is Online:</strong> {values.isOnline ? 'Yes' : 'No'}
          </p>
          <p>
            <strong>Author:</strong> {values.author}
          </p>
          <p>
            <strong>Activity Type:</strong> {values.createAtivityType}
          </p>
          <p>
            <strong>Address Only For Attendees:</strong> {values.addressOnlyForAttendees ? 'Yes' : 'No'}
          </p>
          <p>
            <strong>Invite Community:</strong> {values.inviteCommunity ? 'Yes' : 'No'}
          </p>
          <p>
            <strong>Ages:</strong> {values.ages}
          </p>
          <p>
            <strong>Age Restriction:</strong> {values.ageRestriction ? 'Yes' : 'No'}
          </p>
          <p>
            <strong>Attendees Validation:</strong> {values.attendeesValidation ? 'Yes' : 'No'}
          </p>
          <p>
            <strong>Repeat Event:</strong> {values.repeatEvent ? 'Yes' : 'No'}
          </p>
          {values.repeatEvent && (
            <>
              <p>
                <strong>Repeat Frequency:</strong> {values.repeatEventFrequency}
              </p>
              <p>
                <strong>Repeat Days:</strong> {values.repeatEventDays}
              </p>
            </>
          )}
          <p>
            <strong>Metro Station:</strong> {values.metroStation}
          </p>
          <p>
            <strong>Buy Tickets Link:</strong> {values.buyTicketsLink}
          </p>
          <p>
            <strong>Number of Friends:</strong> {values.friendsNumber}
          </p>
          <p>
            <strong>Notify Previous Attendees:</strong> {values.notifyPreviousAttendees ? 'Yes' : 'No'}
          </p>
          <p>
            <strong>Invite More:</strong> {values.inviteMore ? 'Yes' : 'No'}
          </p>
          <p>
            <strong>Request Co-Organization:</strong> {values.requestCoOrga ? 'Yes' : 'No'}
          </p>
          <p>
            <strong>Attendee Limit:</strong> {values.attendeeLimit}
          </p>
          <p>
            <strong>Allow Guests:</strong> {values.allowGuests ? 'Yes' : 'No'}
          </p>
          <p>
            <strong>Paid Activity:</strong> {values.hasPrice ? 'Yes' : 'No'}
          </p>
          {values.hasPrice && (
            <>
              <p>
                <strong>Price:</strong> {values.price}
              </p>
              <p>
                <strong>Ticket Link:</strong> {values.ticketLink}
              </p>
            </>
          )}
          <p>
            <strong>Info Line:</strong> {values.infoLine}
          </p>
          <p>
            <strong>How to Find:</strong> {values.howToFind}
          </p>
          <p>
            <strong>WhatsApp Link:</strong> {values.whatsappLink}
          </p>
          <p>
            <strong>Facebook Page Link:</strong> {values.fbPageLink}
          </p>
          <p>
            <strong>Facebook Group Link:</strong> {values.fbGroupLink}
          </p>
          <p>
            <strong>Meetup Link:</strong> {values.meetupLink}
          </p>
          <p>
            <strong>Telegram Link:</strong> {values.telegramLink}
          </p>
          <p>
            <strong>Other Links:</strong> {values.otherLink}
          </p>
        </div>
        <div className="card-footer">
          <button type="button" className="btn btn-success" onClick={() => handleSubmit()}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewAndSubmit;
