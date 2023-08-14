import { useContext } from 'react';
import AlertContext from '../modules/AuthContext';

const useAlert = () => useContext(AlertContext);

export default useAlert;