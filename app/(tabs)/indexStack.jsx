import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Modal,
    Pressable,
    TouchableOpacity,
    Platform,
  } from "react-native";
  import React, { useState, useEffect } from "react";
  import { Picker } from "@react-native-picker/picker";
  import Icon from "react-native-vector-icons/FontAwesome";
  import DateTimePicker from "@react-native-community/datetimepicker";
  
  const Todolist = () => {
    const [searchText, setSearchText] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [type, setType] = useState("");
    const [priority, setPriority] = useState("");
    const [description, setDescription] = useState("");
    const [isCompleted, setIsCompleted] = useState(false);
    const [dueDate, setDueDate] = useState(new Date());
    const [dueTime, setDueTime] = useState(new Date());
    const [todos, setTodos] = useState([]);
    const [filteredTodos, setFilteredTodos] = useState([]);
    const [selectedTodo, setSelectedTodo] = useState(null);
    const [showDueDate, setShowDueDate] = useState(false);
    const [showDueTime, setShowDueTime] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [filter, setFilter] = useState("all"); // "all", "completed", "incomplete"
  
    // Filter todos based on search text and filter type
    useEffect(() => {
      const filtered = todos.filter((todo) => {
        const matchesSearch =
          todo.type.toLowerCase().includes(searchText.toLowerCase()) ||
          todo.priority.toLowerCase().includes(searchText.toLowerCase()) ||
          todo.description.toLowerCase().includes(searchText.toLowerCase());
  
        if (filter === "completed") {
          return matchesSearch && todo.isCompleted;
        } else if (filter === "incomplete") {
          return matchesSearch && !todo.isCompleted;
        } else {
          return matchesSearch;
        }
      });
      setFilteredTodos(filtered);
    }, [todos, searchText, filter]);
  
    // Handle adding a new todo
    const handleAddTodo = () => {
      const newTodo = {
        id: todos.length + 1,
        type,
        priority,
        description,
        isCompleted,
        dueDate: dueDate.toLocaleDateString(),
        dueTime: dueTime.toLocaleTimeString(),
      };
      setTodos([...todos, newTodo]);
      resetForm();
      setModalVisible(false);
    };
  
    // Handle updating a todo
    const handleUpdateTodo = () => {
      const updatedTodos = todos.map((todo) =>
        todo.id === selectedTodo.id
          ? {
              ...todo,
              type,
              priority,
              description,
              isCompleted,
              dueDate: dueDate.toLocaleDateString(),
              dueTime: dueTime.toLocaleTimeString(),
            }
          : todo
      );
      setTodos(updatedTodos);
      resetForm();
      setModalVisible(false);
      setSelectedTodo(null);
      setIsEditing(false);
    };
  
    // Handle deleting a todo
    const handleDeleteTodo = (id) => {
      const newTodos = todos.filter((todo) => todo.id !== id);
      setTodos(newTodos);
    };
  
    // Toggle task completion status
    const toggleTaskCompletion = (id) => {
      const updatedTodos = todos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      );
      setTodos(updatedTodos);
    };
  
    // Reset form fields
    const resetForm = () => {
      setType("");
      setPriority("");
      setDescription("");
      setIsCompleted(false);
      setDueDate(new Date());
      setDueTime(new Date());
    };
  
    // Handle date picker change
    const onChangeDueDate = (event, selectedDate) => {
      const currentDate = selectedDate || dueDate;
      setShowDueDate(Platform.OS === "ios");
      setDueDate(currentDate);
    };
  
    // Handle time picker change
    const onChangeDueTime = (event, selectedTime) => {
      const currentTime = selectedTime || dueTime;
      setShowDueTime(Platform.OS === "ios");
      setDueTime(currentTime);
    };
  
    // Render date picker
    const renderDatePicker = () => {
      if (Platform.OS === "web") {
        return (
          <input
            type="date"
            value={dueDate.toISOString().split("T")[0]}
            onChange={(e) => setDueDate(new Date(e.target.value))}
            style={styles.webDateInput}
          />
        );
      } else {
        return (
          <>
            <Pressable
              style={styles.dueDateButton}
              onPress={() => setShowDueDate(true)}
            >
              <Text style={styles.dueDateButtonText}>
                {dueDate.toLocaleDateString()}
              </Text>
            </Pressable>
            {showDueDate && (
              <DateTimePicker
                testID="dateTimePicker"
                value={dueDate}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={onChangeDueDate}
              />
            )}
          </>
        );
      }
    };
  
    // Render time picker
    const renderTimePicker = () => {
      if (Platform.OS === "web") {
        return (
          <input
            type="time"
            value={dueTime.toTimeString().split(" ")[0]}
            onChange={(e) => setDueTime(new Date(`1970-01-01T${e.target.value}`))}
            style={styles.webTimeInput}
          />
        );
      } else {
        return (
          <>
            <Pressable
              style={styles.dueTimeButton}
              onPress={() => setShowDueTime(true)}
            >
              <Text style={styles.dueTimeButtonText}>
                {dueTime.toLocaleTimeString()}
              </Text>
            </Pressable>
            {showDueTime && (
              <DateTimePicker
                testID="dateTimePicker"
                value={dueTime}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={onChangeDueTime}
              />
            )}
          </>
        );
      }
    };
  
    const handleEditTodo = (todo) => {
      setSelectedTodo(todo);
      setType(todo.type);
      setPriority(todo.priority);
      setDescription(todo.description);
      setIsCompleted(todo.isCompleted);
      setDueDate(new Date(todo.dueDate));
      setDueTime(new Date(todo.dueTime));
      setModalVisible(true);
      setIsEditing(true);
    };
  
    const handleViewDetails = (todo) => {
      setSelectedTodo(todo);
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.text}>TodoList</Text>
  
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
          />
        </View>
  
        {/* Filter Buttons */}
        <View style={styles.filterButtons}>
          <Pressable
            style={[
              styles.filterButton,
              filter === "all" && styles.activeFilterButton,
            ]}
            onPress={() => setFilter("all")}
          >
            <Text style={styles.filterButtonText}>All</Text>
          </Pressable>
          <Pressable
            style={[
              styles.filterButton,
              filter === "completed" && styles.activeFilterButton,
            ]}
            onPress={() => setFilter("completed")}
          >
            <Text style={styles.filterButtonText}>Completed</Text>
          </Pressable>
          <Pressable
            style={[
              styles.filterButton,
              filter === "incomplete" && styles.activeFilterButton,
            ]}
            onPress={() => setFilter("incomplete")}
          >
            <Text style={styles.filterButtonText}>Incomplete</Text>
          </Pressable>
        </View>
  
        {/* Todo List */}
        <View>
          {filteredTodos.map((todo) => (
            <View key={todo.id} style={styles.todoItem}>
              <View style={styles.todoBox}>
                <Text style={styles.todoText}>{todo.type}</Text>
                <View style={styles.todoActions}>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteTodo(todo.id)}
                  >
                    <Icon name="trash-o" size={20} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditTodo(todo)}
                  >
                    <Icon name="pencil" size={20} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.viewDetailsButton}
                    onPress={() => handleViewDetails(todo)}
                  >
                    <Text style={styles.viewDetailsButtonText}>?</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.completeButton}
                    onPress={() => toggleTaskCompletion(todo.id)}
                  >
                    <Icon
                      name={todo.isCompleted ? "check-square-o" : "square-o"}
                      size={20}
                      color={todo.isCompleted ? "green" : "white"}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
  
        {/* Add/Edit Todo Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalView}>
            <Text style={[styles.modalText, { color: "blue" }]}>
              {isEditing ? "Edit Todo" : "Add Todo"}
            </Text>
  
            {/* Type Picker */}
            <View style={styles.pickerContainer}>
              <Text style={[styles.pickerLabel, { color: "blue" }]}>Type:</Text>
              <Picker
                selectedValue={type}
                onValueChange={(itemValue) => setType(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Homework" value="Homework" />
                <Picker.Item label="CA" value="CA" />
                <Picker.Item label="Presentation" value="Presentation" />
                <Picker.Item label="Project" value="Project" />
                <Picker.Item label="Lessons" value="Lessons" />
                <Picker.Item label="Quiz" value="Quiz" />
                <Picker.Item label="Study" value="Study" />
              </Picker>
            </View>
  
            {/* Priority Picker */}
            <View style={styles.pickerContainer}>
              <Text style={[styles.pickerLabel, { color: "blue" }]}>
                Priority:
              </Text>
              <Picker
                selectedValue={priority}
                onValueChange={(itemValue) => setPriority(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="None" value="None" />
                <Picker.Item label="High" value="High" />
                <Picker.Item label="Medium" value="Medium" />
                <Picker.Item label="Low" value="Low" />
                <Picker.Item label="Next" value="Next" />
              </Picker>
            </View>
  
            {/* Description Input */}
            <TextInput
              style={styles.descriptionInput}
              placeholder="Todo Description"
              value={description}
              onChangeText={(text) => setDescription(text)}
            />
  
            {/* Due Date */}
            <View style={styles.dueDateContainer}>
              <Text style={styles.dueDateLabel}>Due Date:</Text>
              {renderDatePicker()}
            </View>
  
            {/* Due Time */}
            <View style={styles.dueTimeContainer}>
              <Text style={styles.dueTimeLabel}>Due Time:</Text>
              {renderTimePicker()}
            </View>
  
            {/* Completed Checkbox */}
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setIsCompleted(!isCompleted)}
              >
                {isCompleted && <View style={styles.checkboxCheck} />}
              </TouchableOpacity>
              <Text style={[styles.checkboxLabel, { color: "blue" }]}>
                Completed
              </Text>
            </View>
  
            {/* Add/Update Button */}
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={isEditing ? handleUpdateTodo : handleAddTodo}
            >
              <Text style={[styles.textStyle, { color: "white" }]}>
                {isEditing ? "Update" : "Add"}
              </Text>
            </Pressable>
          </View>
        </Modal>
  
        {/* Add to-do button */}
        <Pressable
          style={styles.addButton}
          onPress={() => {
            resetForm();
            setModalVisible(true);
            setIsEditing(false);
          }}
        >
          <Text style={styles.buttonText}>Add to-do</Text>
        </Pressable>
  
        {/* View Details Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={selectedTodo !== null && !isEditing}
          onRequestClose={() => {
            setSelectedTodo(null);
          }}
        >
          {selectedTodo && (
            <View style={styles.modalView}>
              <Text style={[styles.modalText, { color: "blue" }]}>
                Todo Details
              </Text>
  
              <Text style={styles.todoText}>Type: {selectedTodo.type}</Text>
              <Text style={styles.todoText}>
                Priority: {selectedTodo.priority}
              </Text>
              <Text style={styles.todoText}>
                Description: {selectedTodo.description}
              </Text>
              <Text style={styles.todoText}>
                Due Date: {selectedTodo.dueDate}
              </Text>
              <Text style={styles.todoText}>
                Due Time: {selectedTodo.dueTime}
              </Text>
              <Text style={styles.todoText}>
                Completed: {selectedTodo.isCompleted ? "Yes" : "No"}
              </Text>
  
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setSelectedTodo(null)}
              >
                <Text style={[styles.textStyle, { color: "white" }]}>Close</Text>
              </Pressable>
            </View>
          )}
        </Modal>
      </View>
    );
  };
  
  export default Todolist;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#374957",
      paddingTop: 50,
    },
    searchBar: {
      height: 50,
      backgroundColor: "#f0f0f0",
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 20,
      marginHorizontal: 10,
      marginBottom: 10,
      flexDirection: "row",
      alignItems: "center",
      width: "80%",
    },
    searchInput: {
      flex: 1,
      fontSize: 14,
      color: "#333",
    },
    text: {
      color: "black",
      fontSize: 42,
      fontWeight: "bold",
      textAlign: "center",
      backgroundColor: "#374957",
      height: "60",
    },
    addButton: {
      backgroundColor: "skyblue",
      padding: 5,
      borderRadius: 10,
      marginBottom: 20,
      alignSelf: "center",
      position: "absolute",
      bottom: 10,
      paddingHorizontal: 29,
      paddingVertical: 10,
    },
    buttonText: {
      color: "white",
      fontWeight: "bold",
      fontSize: 12,
    },
    modalView: {
      margin: 20,
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      borderRadius: 20,
      padding: 35,
      alignItems: "left",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center",
    },
    pickerContainer: {
      marginBottom: 10,
    },
    pickerLabel: {
      marginBottom: 5,
    },
    picker: {
      width: 150,
    },
    descriptionInput: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
      padding: 10,
      marginBottom: 15,
      width: "80%",
    },
    checkboxContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 15,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 3,
      marginRight: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    checkboxCheck: {
      width: 12,
      height: 12,
      backgroundColor: "green",
      borderRadius: 3,
    },
    checkboxLabel: {
      fontSize: 16,
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    buttonClose: {
      backgroundColor: "#2196F3",
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center",
    },
    todoItem: {
      padding: 10,
      borderBottomWidth: 1,
      fontWeight: "bold",
      borderBottomColor: "#374957",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    todoBox: {
      backgroundColor: "grey",
      padding: 10,
      borderRadius: 10,
      width: "70%",
    },
    todoText: {
      fontSize: 16,
    },
    todoActions: {
      width: "30%",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    deleteButton: {
      backgroundColor: "grey",
      padding: 5,
      borderRadius: 5,
    },
    editButton: {
      backgroundColor: "grey",
      padding: 5,
      borderRadius: 5,
      marginVertical: 5,
    },
    viewDetailsButton: {
      backgroundColor: "grey",
      padding: 5,
      borderRadius: 5,
    },
    viewDetailsButtonText: {
      color: "white",
      fontWeight: "bold",
      fontSize: 12,
    },
    completeButton: {
      backgroundColor: "grey",
      padding: 5,
      borderRadius: 5,
    },
    filterButtons: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 10,
    },
    filterButton: {
      padding: 10,
      borderRadius: 5,
      backgroundColor: "#f0f0f0",
    },
    activeFilterButton: {
      backgroundColor: "#2196F3",
    },
    filterButtonText: {
      color: "black",
      fontWeight: "bold",
    },
    dueDateContainer: {
      marginBottom: 10,
    },
    dueDateLabel: {
      marginBottom: 5,
    },
    dueDateButton: {
      backgroundColor: "white",
      padding: 10,
      borderRadius: 5,
      marginBottom: 10,
    },
    dueDateButtonText: {
      fontSize: 16,
    },
    dueTimeButton: {
      backgroundColor: "white",
      padding: 10,
      borderRadius: 5,
      marginBottom: 10,
    },
    dueTimeButtonText: {
      fontSize: 16,
    },
    webDateInput: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
      width: "80%",
    },
    webTimeInput: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
      width: "80%",
    },
  });