import React, {useCallback, useEffect} from 'react';
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, ButtonGroup, Grid, IconButton, List, Typography} from "@material-ui/core";
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";
import {Task} from "./Task";
import {TaskStatuses, TaskType} from "../api/todolists-api";
import {FilterValuesType} from "../store/todolist-reducer";
import {useDispatch} from "react-redux";
import {getTasksTC} from "../store/tasks-reducer";

type TodoListPropsType = {
    title: string
    todoListID: string
    addTask: (title: string, todoListID: string) => void
    tasks: Array<TaskType>
    filter: FilterValuesType
    removeTask: (id: string, todoListID: string) => void
    changeTodoListFilter: (filter: FilterValuesType, todoListID: string) => void
    changeTaskStatus: (id: string, status: TaskStatuses, todoListID: string) => void
    removeTodoList: (todoListID: string) => void
    changeTasksTitle: (taskID: string, title: string, todoListID: string) => void
    changeTodoListTitle: (title: string, todoListID: string) => void
}

const TodoList = React.memo((props: TodoListPropsType) => {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getTasksTC(props.todoListID))
    }, [])

    const addTask = useCallback((title: string) => {
        props.addTask(title, props.todoListID);
    }, [props.addTask, props.todoListID])

    const changeTodoListTitle = useCallback((title: string) => {
        props.changeTodoListTitle(title, props.todoListID)
    }, [props.changeTodoListTitle, props.todoListID])

    let tasksForTodoList = props.tasks
    if (props.filter === "active") {
        tasksForTodoList = tasksForTodoList.filter(t => t.status === TaskStatuses.New);
    }
    if (props.filter === "completed") {
        tasksForTodoList = tasksForTodoList.filter(t => t.status === TaskStatuses.Completed);
    }

    const tasksList = tasksForTodoList.map((t) => {
        return <>
            <Task key={props.todoListID}
                  todoListID={props.todoListID}
                  task={t}
                  removeTask={props.removeTask}
                  changeTaskStatus={props.changeTaskStatus}
                  changeTasksTitle={props.changeTasksTitle}/>

        </>
    })

    const onClickSetAllFilter = useCallback(() => props.changeTodoListFilter("all", props.todoListID),
        [props.changeTodoListFilter, props.todoListID])
    const onClickSetActiveFilter = useCallback(() => props.changeTodoListFilter("active", props.todoListID),
        [props.changeTodoListFilter, props.todoListID])
    const onClickSetCompletedFilter = useCallback(() => props.changeTodoListFilter("completed", props.todoListID),
        [props.changeTodoListFilter, props.todoListID])
    const removeTodoList = useCallback(() => props.removeTodoList(props.todoListID), [props.removeTodoList, props.todoListID])

    return (
        <Grid container direction={"column"}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '400px',
                position: 'relative'
            }}><Grid item>
                <Typography variant={'h5'} align={'center'} style={{fontWeight: 'bold'}}>
                    <EditableSpan title={props.title} changeTitle={changeTodoListTitle}/>

                    <IconButton onClick={removeTodoList} color={'primary'}
                                size={'small'}><DeleteForeverOutlinedIcon/></IconButton>
                </Typography>
            </Grid>
                <Grid item>
                    <AddItemForm addItem={addTask}/>

                    <List style={{textAlign: 'center'}}>
                        {tasksList}
                    </List>
                </Grid>
                <div>
                    <ButtonGroup size={'small'} variant={'contained'} disableElevation
                                 fullWidth style={{position: 'absolute', bottom: '0'}}
                    >
                        <Button
                            color={props.filter === 'all' ? 'secondary' : 'primary'}
                            onClick={onClickSetAllFilter}
                        >All
                        </Button>
                        <Button
                            color={props.filter === 'active' ? 'secondary' : 'primary'}
                            onClick={onClickSetActiveFilter}
                        >Active
                        </Button>
                        <Button
                            color={props.filter === 'completed' ? 'secondary' : 'primary'}
                            onClick={onClickSetCompletedFilter}
                        >Completed
                        </Button>
                    </ButtonGroup>
                </div>

            </div>
        </Grid>

    )
})

export default TodoList;