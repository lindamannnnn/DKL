import { judgeCode } from './src/services/judgeService';
(async () => {
  try {
    const result = await judgeCode({
      src: '#include <iostream>\nint main(){std::cout << "Hello, World!";return 0;}',
      language: 'C++',
      testCases: [
        { input: '', expectedOutput: 'Hello, World!' },
        { input: '', expectedOutput: 'Hello, World!' }
      ],
      timeLimit: 1000,
      memoryLimit: 128
    });
    console.log('Result:', JSON.stringify(result, null, 2));
  } catch (e: any) {
    console.error('Error:', e.message);
    console.error(e.stack);
  }
})();
