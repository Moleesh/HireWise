/** @format */

import { useContext } from 'react';
import { ThemeContext } from './themeContext';

/** useTheme - Hook to access theme context */
const useTheme = () => useContext(ThemeContext);

export default useTheme;
