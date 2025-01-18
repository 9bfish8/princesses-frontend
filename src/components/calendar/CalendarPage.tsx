'use client';

import { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns';
import api from '@/lib/axios';
import { ko } from 'date-fns/locale';
import { useRouter } from 'next/navigation';

interface Event {
    id: number;
    title: string;
    date: string;
    user: {
        username: string;
        color: string;
    };
}

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<Event[]>([]);
    const [showEventForm, setShowEventForm] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [newEvent, setNewEvent] = useState({ title: '' });
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [username, setUsername] = useState<string>('');
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUsername = localStorage.getItem('username');
        if (!token) {
            router.push('/');
            return;
        }
        if (storedUsername) {
            setUsername(storedUsername);
        }
        fetchEvents();
    }, [router]);

    const fetchEvents = async () => {
        try {
            const response = await api.get('/events');
            setEvents(response.data);
        } catch (error) {
            console.error('이벤트 불러오기 실패:', error);
        }
    };

    const handleAddEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDate) return;

        try {
            if (editingEvent) {
                await api.put(`/events/${editingEvent.id}`, {
                    title: newEvent.title,
                    date: selectedDate.toISOString(),
                });
            } else {
                await api.post('/events', {
                    title: newEvent.title,
                    date: selectedDate.toISOString(),
                });
            }

            setNewEvent({ title: '' });
            setShowEventForm(false);
            setEditingEvent(null);
            fetchEvents();
        } catch (error) {
            console.error('이벤트 처리 실패:', error);
        }
    };

    const handleDeleteEvent = async (eventId: number) => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            try {
                await api.delete(`/events/${eventId}`);
                fetchEvents();
            } catch (error) {
                console.error('이벤트 삭제 실패:', error);
            }
        }
    };

    const handleEditEvent = (event: Event) => {
        setEditingEvent(event);
        setSelectedDate(new Date(event.date));
        setNewEvent({ title: event.title });
        setShowEventForm(true);
    };

    const getDaysInMonth = () => {
        const start = startOfMonth(currentDate);
        const end = endOfMonth(currentDate);
        return eachDayOfInterval({ start, end });
    };

    const days = getDaysInMonth();

    const handleLogout = () => {
        localStorage.clear();
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm p-4 mb-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-indigo-600">공주들 📅</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-600">{username}님 환영합니다!</span>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                        >
                            로그아웃
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto p-4">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-gray-800">
                            {format(currentDate, 'yyyy년 M월', { locale: ko })}
                        </h2>
                        <div className="space-x-2">
                            <button
                                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                                className="px-4 py-2 text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors"
                            >
                                이전 달
                            </button>
                            <button
                                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                                className="px-4 py-2 text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors"
                            >
                                다음 달
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-4">
                        {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                            <div key={day} className="text-center font-bold py-2 text-gray-600">
                                {day}
                            </div>
                        ))}

                        {days.map((day) => {
                            const dayEvents = events.filter(event =>
                                format(new Date(event.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
                            );

                            return (
                                <div
                                    key={day.toString()}
                                    onClick={() => {
                                        setSelectedDate(day);
                                        setEditingEvent(null);
                                        setNewEvent({ title: '' });
                                        setShowEventForm(true);
                                    }}
                                    className={`min-h-[120px] border rounded-lg p-2 cursor-pointer transition-all hover:shadow-md ${
                                        isSameMonth(day, currentDate) ? 'bg-white' : 'bg-gray-50'
                                    }`}
                                >
                                    <div className="font-semibold text-gray-700">
                                        {format(day, 'd')}
                                    </div>
                                    <div className="space-y-1 mt-1">
                                        {dayEvents.map((event) => (
                                            <div
                                                key={event.id}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (event.user.username === username) {
                                                        handleEditEvent(event);
                                                    }
                                                }}
                                                className="text-sm p-2 rounded-md text-white transition-transform hover:scale-105"
                                                style={{ backgroundColor: event.user.color }}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span>{event.title}</span>
                                                    {event.user.username === username && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteEvent(event.id);
                                                            }}
                                                            className="text-white hover:text-red-200 ml-2"
                                                        >
                                                            ×
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="text-xs opacity-75">{event.user.username}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {showEventForm && selectedDate && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h3 className="text-xl font-bold mb-4 text-gray-800">
                            {format(selectedDate, 'yyyy년 M월 d일', { locale: ko })}에 일정 {editingEvent ? '수정' : '추가'}
                        </h3>
                        <form onSubmit={handleAddEvent} className="space-y-4">
                            <input
                                type="text"
                                value={newEvent.title}
                                onChange={(e) => setNewEvent({ title: e.target.value })}
                                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="일정 제목"
                                required
                            />
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEventForm(false);
                                        setEditingEvent(null);
                                        setNewEvent({ title: '' });
                                    }}
                                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                                >
                                    {editingEvent ? '수정' : '추가'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}