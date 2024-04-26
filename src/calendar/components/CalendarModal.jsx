import { addHours, differenceInSeconds } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import Modal from 'react-modal';
import Datepicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { es } from 'date-fns/locale';
import Swal from 'sweetalert2';
import { useCalendarStore, useUiStore } from '../../hooks';


registerLocale('es', es)

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

Modal.setAppElement('#root');

export const CalendarModal = () => {

    // estado desde nuestro custoom hook
    const { isDateModalOpen, closeDateModal } = useUiStore();

    // extraer la funcion que inicia el proceso de grabacion
    const { activeEvent, startSavingEvent } = useCalendarStore()

    //nuevo estado para cuando se ingrese el evento
    const [formSubmitted, setFormSubmitted] = useState(false)

    /////////////////////////////////////////////
    const [formValues, setFormValues] = useState({
        title: '',
        notes: '',
        start: new Date(),
        end: addHours ( new Date(), 2)
    });

    // utilizamos el useMemo
    const titleClass = useMemo(() => {

        if(!formSubmitted) return '';

        return (formValues.title.length > 0) 
        ? 'is-valid' 
        : 'is-invalid'

    }, [formValues.title, formSubmitted])

    //todo: crear useEffect
    useEffect( () => {
        if ( activeEvent !== null ){
            setFormValues({ ...activeEvent })
        }
    }, [ activeEvent ]);

    const onInputChanged = ({target }) => {
        setFormValues({
            ...formValues,
            [target.name] : target.value
        })
    }

    const onDateChanged = (event, changing) => {
        setFormValues({
            ...formValues,
            [changing] : event
        })
    }

    const onCloseModal = () => {
        closeDateModal();
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        setFormSubmitted(true)

        const difference = differenceInSeconds(formValues.end, formValues.start);
        console.log({difference});

        if ( isNaN( difference )  || difference <= 0) {
            Swal.fire(
              'Fechas Incorrectas',
              'Por favor revisa las fechas ingresadas',
              'error')
            return;
          }

          if (formValues.title.length <= 0) {
            Swal.fire(
              'Titulo de la Nota',
              'No ha ingresado un titulo para la nota',
              'error'
            );
            return;
          }

        console.log(formValues)

        // grabacion del evento
        await startSavingEvent( formValues )
        
        closeDateModal()

        setFormSubmitted(false)
    }

    return(
        <Modal
            isOpen={ isDateModalOpen }
            onRequestClose={onCloseModal}
            style={customStyles}

            className='modal' //asi se llama la clase en css
            overlayClassName='modal-fondo' //clase de css
            closeTimeoutMS={200}
        >
        
        <h2>Nuevo Evento</h2>
        <hr />
        <form className='container' onSubmit={onSubmit}>
            <div className='form-group mb-2'>
                <label>Fecha y hora de inicio</label>
                <Datepicker
                    selected={formValues.start} // fecha de inicio seleccionada
                    className={'form-control'}
                    onChange={(event) => onDateChanged(event, 'start')}
                    dateFormat='Pp'
                    showTimeSelect
                    locale='es'
                    timeCaption='Hora'
                />
            </div>

            <div className='form-group mb-2'>
                <label>Fecha y hora de fin</label>
                <Datepicker
                    // minDate={formValues.start}
                    selected={formValues.end} // fecha de fin seleccionada
                    className='form-control'
                    onChange={(event) => onDateChanged(event, 'end')}
                    dateFormat='Pp'
                    showTimeSelect
                    locale='es'
                    timeCaption='Hora'
                />
            </div>

            <hr />
            <div className='form-group mb-2'>
                <label>Titulo y notas</label>
                <input 
                    type="text"
                    className={`form-control ${titleClass} `}
                    placeholder='Titulo del evento'
                    autoComplete='off'
                    name='title'

                    value={formValues.title}
                    onChange={onInputChanged}
                />
                <small className='form-text text-muted'>Una descripcion corta</small>
            </div>

            <div className='form-group mb-2'>
                <textarea 
                    type='text'
                    className='form-control'
                    placeholder='Notas'
                    rows='5'
                    name='notes'

                    value={formValues.notes}
                    onChange={onInputChanged}
                />
                <small className='form-text text-muted'>Informacion adicional</small>
            </div>

            <button type='submit' className='btn btn-outline-primary btn-block'>
                <i className='far fa-save'/>
                &nbsp;
                <span>Guardar</span>
            </button>
        </form>

        </Modal>
    )
}