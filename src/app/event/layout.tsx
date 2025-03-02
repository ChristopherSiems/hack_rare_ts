// app/events/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Health Awareness Events',
  description: 'Upcoming health awareness events and campaigns',
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="events-layout">
      {children}
    </div>
  );
}