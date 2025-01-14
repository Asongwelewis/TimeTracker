import 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Settings from '../Screens/Settings';

import Homework from '../Screens/Homework';
import Classes from '../Screens/Classes';
import Calender from '../Screens/Calender';
import Todolist from './indexStack'
const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <Drawer.Navigator initialRouteName="Todolist">
      
      <Drawer.Screen name="Settings" component={Settings} />
      <Drawer.Screen name="Homework" component={Homework} />
      <Drawer.Screen name="Classes" component={Classes} />
      <Drawer.Screen name="Calender" component={Calender} />
      <Drawer.Screen name="Todolist" component={Todolist}/>
    </Drawer.Navigator>
  );
}





