import React, { createContext, useEffect, useReducer, useState } from 'react';
import { Person, PersonHelper } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { ascending, descending, debounce } from 'shared/helpers/utils';

interface StudentContextType {
    handleFilter: (e: string) => void
    handleSort: () => void
    onSortBy: () => void
    handleStudentStatus: (id: number, value: string) => void,
    onFilterByStatus: (status: string) => void
    data: {
        students: Person[]
    } | undefined,
    loadState: string,
    sortBy: string,
    sortType: string,
    studentStatusMapById: {
        [id: number]: string
    },
    studentStatusCount: {
        absent: number,
        all: number,
        present: number,
        late: number,
    }
}

export const StudentContext = createContext<StudentContextType>({
    handleFilter: (e: string) => { },
    handleSort: () => { },
    onSortBy: () => { },
    handleStudentStatus: () => { },
    onFilterByStatus: () => { },
    loadState: '',
    data: {
        students: [] as Person[]
    },
    sortBy: '',
    sortType: '',
    studentStatusMapById: {},
    studentStatusCount: {
        absent: 0,
        all: 0,
        present: 0,
        late: 0,
    }
});

interface StudentProviderProps {
    children: React.ReactNode,
}

export default function StudentProvider({ children }: StudentProviderProps) {
    const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" });
    const [filteredData, setFilteredData] = useState<{ students: Person[] }>();
    const [studentStatusMapById, setStudentStatusMapById] = useState<{ [id: number]: string }>({});
    const [studentStatusCount, setStudentStatusCount] = useState({
        absent: 0,
        present: 0,
        late: 0, all: 0
    })
    const [sortBy, setSortBy] = useState('first_name');
    const [sortType, setSortType] = useState('');

    useEffect(() => {
        void getStudents()
    }, [getStudents])

    useEffect(() => {
        setFilteredData(data)
        if (data?.students.length) {
            setStudentStatusCount((preState) => ({
                ...preState,
                all: data?.students.length,
            }))
        }
    }, [data])

    useEffect(() => {
        const newStudentStatusCount = {
            ...studentStatusCount,
            absent: 0,
            present: 0,
            late: 0,
        };
        Object.values(studentStatusMapById).forEach(status => {
            if (status === 'late') {
                newStudentStatusCount.late += 1;
            } else if (status === 'present') {
                newStudentStatusCount.present += 1;
            } else if (status === 'absent') {
                newStudentStatusCount.absent += 1;
            }
        })
        setStudentStatusCount(newStudentStatusCount)
    }, [studentStatusMapById])

    const handleSort = () => {
        const newSortType = sortType === 'ascending' ? 'descending' : 'ascending';
        if (sortType === 'ascending') {
            setFilteredData(ascending(filteredData as { students: Person[] }, sortBy as keyof Person))
        } else {
            setFilteredData(descending(filteredData as { students: Person[] }, sortBy as keyof Person))
        }
        setSortType(newSortType);
    }

    const onSortBy = () => {
        const newSortBy = sortBy === 'first_name' ? 'last_name' : 'first_name';
        setSortBy(newSortBy)
    }

    const handleFilter = debounce((value: string, filterBy?: string) => {
        const postData = { ...filteredData };
        if (value) {
            postData.students = data?.students.filter(student => PersonHelper.getFullName(student).toLowerCase().includes(value.toLowerCase()))
        } else {
            postData.students = data?.students;
        }
        setFilteredData(postData as { students: Person[] })
    }, 1000)

    const handleStudentStatus = (id: number, status: string) => {
        const newStatus = { ...studentStatusMapById };
        newStatus[id] = status;
        setStudentStatusMapById(newStatus)
    }

    const onFilterByStatus = (status: string) => {
        console.log({status})
        if (status === 'all') {
            setFilteredData(data);
            return
        }
        const filteredStudent = data?.students.filter(student => studentStatusMapById[student.id] === status);
        if (filteredStudent) {
            setFilteredData({
                students: filteredStudent
            });
        }
    }

    const value = {
        data: filteredData,
        loadState,
        handleSort,
        sortBy,
        sortType,
        onSortBy,
        handleFilter,
        handleStudentStatus,
        studentStatusCount,
        studentStatusMapById,
        onFilterByStatus
    }


    return <StudentContext.Provider value={value}>
        {children}
    </StudentContext.Provider>
}