import { useDispatch, useSelector } from "react-redux";
import { onCloseDateModal, onOpenDateModal } from "../store"; //importar desde la store


export const useUiStore = () => {

    const {
        isDateModalOpen 
    } = useSelector( state => state.ui);

    const dispatch = useDispatch();

    const openDateModal = () => {
        dispatch( onOpenDateModal() );
    }

    // TODO: crearfuncion para cerrar modal
    const closeDateModal = () => {
        dispatch( onCloseDateModal() );
    }
    return {
        // * Propiedades
        isDateModalOpen,

        // * Metodos
        openDateModal,
        closeDateModal // ? retornar la nueva funcion (metodo)
    }
}
