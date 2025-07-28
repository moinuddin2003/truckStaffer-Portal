import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { createEventId } from '../../hook/event-utils.js'
import './Calendar.css'

export default function Calendar({ events = [] }) {

    // Transform API events to FullCalendar format
    const calendarEvents = events.map(event => ({
        id: event.id,
        title: event.title,
        start: event.start,
        end: event.end,
        description: event.description,
        priority: event.priority,
        backgroundColor: getPriorityColor(event.priority),
        borderColor: getPriorityColor(event.priority),
        textColor: '#ffffff',
        extendedProps: {
            description: event.description,
            priority: event.priority
        }
    }));

    function getPriorityColor(priority) {
        switch (priority) {
            case 'high':
                return '#ef4a00'; // danger-main (red)
            case 'medium':
                return '#ff9f29'; // warning-main (orange)
            case 'low':
                return '#00b8f2'; // cyan
            default:
                return '#F0831C'; // primary-600 (brand orange)
        }
    }

    function handleDateSelect(selectInfo) {
        let title = prompt('Please enter a new title for your event')
        let calendarApi = selectInfo.view.calendar

        calendarApi.unselect()

        if (title) {
            calendarApi.addEvent({
                id: createEventId(),
                title,
                start: selectInfo.startStr,
                end: selectInfo.endStr,
                allDay: selectInfo.allDay
            })
        }
    }

    function handleEventClick(clickInfo) {
        // Show event details instead of deleting
        const event = clickInfo.event;
        alert(`
            Event: ${event.title}
            Start: ${event.start?.toLocaleString()}
            End: ${event.end?.toLocaleString()}
            Description: ${event.extendedProps.description || 'No description'}
            Priority: ${event.extendedProps.priority || 'Not set'}
        `);
    }

    return (
        <div className='demo-app'>
            <div className='demo-app-main'>
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    headerToolbar={{
                        left: 'title',
                        center: 'timeGridDay,timeGridWeek,dayGridMonth',
                        right: 'prev,next today'
                    }}
                    initialView='dayGridMonth'
                    editable={true}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    weekends={true}
                    events={calendarEvents}
                    select={handleDateSelect}
                    eventContent={renderEventContent}
                    eventClick={handleEventClick}
                    height="auto"
                />
            </div>
        </div>
    )
}

function renderEventContent(eventInfo) {
    const priority = eventInfo.event.extendedProps.priority || 'default';
    
    return (
        <div 
            className="event-content"
            data-priority={priority}
        >
            <div className="event-title">{eventInfo.event.title}</div>
            {eventInfo.event.extendedProps.description && (
                <div className="event-description">
                    {eventInfo.event.extendedProps.description}
                </div>
            )}
        </div>
    )
}


