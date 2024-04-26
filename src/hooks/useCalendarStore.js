import { useDispatch, useSelector } from "react-redux";
import { onAddNewEvent, onDeleteEvent, onSetActiveEvent, onUpdateEvent } from "../store";

export const  useCalendarStore = () => {

    const dispatch = useDispatch();

    const { events, activeEvent} = useSelector( state => state.calendar);

    const setActiveEvent = (calendarEvent) => {
      dispatch( onSetActiveEvent ( calendarEvent ) );
    }

    const startSavingEvent = async( calendarEvent) => {
        // Idealmente procesos deberian de llegar aca desde el backend

        if( calendarEvent._id ){
          //Estamos haciendo una modificaion a la nota
          dispatch( onUpdateEvent({ ...calendarEvent }) )
        } else {
          // Creando una nueva nota
          dispatch( onAddNewEvent({ ...calendarEvent, _id: new Date().getTime() }) );
        }
    }

    const startDeletingEvent = () => {
      dispatch( onDeleteEvent )
    }
    // TODO: Mnadar a llamar esto desde el modal en calendarModarl. jsx

    return {
      // * Propiedades
      events,
      activeEvent,
      hasEventSelected: !!activeEvent,

      //  *Metodos
      setActiveEvent,
      startSavingEvent,
      startDeletingEvent,
    }
}

