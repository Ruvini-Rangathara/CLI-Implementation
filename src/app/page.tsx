// import Terminal from '@/components/Terminal';

// export default function Home() {
//   return (
//     <main className="min-h-screen p-8 bg-gray-900">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-2xl font-bold text-white mb-6">Browser Terminal</h1>
//         <Terminal />
//       </div>
//     </main>
//   );
// }


import TerminalWrapper from '../components/TerminalWrapper';

export default function Home() {
  return (
    <main style={{ height: '100vh' }}>
      <TerminalWrapper />
    </main>
  );
}