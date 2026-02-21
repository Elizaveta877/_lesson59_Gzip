console.log('#58. JavaScript homework example file');

/*
 *
 * #1
 *
 * Технічне завдання для розробки функції "compressFile"
 *
 * Задача:
 * Розробити асинхронну функцію, що використовує алгоритм Gzip для компресії заданого файлу.
 * Функція має генерувати унікальне ім'я для компресованого файлу, якщо файл з таким іменем вже існує,
 * та забезпечувати високий рівень надійності та безпеки процесу компресії.
 *
 * Функціональні вимоги:
 * 1. Вхідні параметри:
 *    - `filePath`: Шлях до файлу, який потрібно компресувати.
 *
 * 2. Вихідні дані:
 *    - Функція повертає шлях до компресованого файлу як рядок.
 *
 * 3. Унікальність:
 *    - Перевірка наявності існуючих файлів з таким самим іменем і створення унікального імені файлу
 *      шляхом додавання номера до існуючого імені, якщо необхідно.
 *
 * 4. Обробка помилок:
 *    - Функція має ідентифікувати та коректно обробляти помилки читання, запису та доступу до файлів.
 *    - В разі помилок, функція має повертати відповідні повідомлення про помилку або коди помилок,
 *      що дозволяють користувачеві або іншим частинам програми адекватно реагувати на такі ситуації.
 *
 * Технічні вимоги:
 * - Використання сучасних можливостей JavaScript (ES6+), включаючи асинхронні функції, стрімове API Node.js, та ESM
 *   для легкої інтеграції та тестування.
 * - Функція має бути написана таким чином, щоб її можна було експортувати та використовувати в інших частинах програми
 *   або тестових сценаріях.
 * - Забезпечення документації коду з описом параметрів, процесу роботи, виключень, які можуть бути сгенеровані,
 *   та прикладами використання.
 * - Підготовка функції для можливості легкого мокування та тестування за допомогою JEST.
 *
 */

async function compressFile(filePath) {
  if (!filePath || typeof filePath !== 'string') {
    throw new Error('Invalid file path')
  }

  try {
    await access(filePath)
  } catch (error) {
    throw new Error(`File not found: ${filePath}`)
  }
  const { dir, name, ext} = path.parse(filePath)
  let outputPath = path.join(dir, `${name}${ext}.gz`)
  let counter = 1

while (true) {
  try {
    await access(outputPath)
    outputPath = path.join(dir, `${name}(${counter}).gz`)
    counter++ 
  } catch (error) {
    break
  }
}

const gzip = createGzip()
const source = createReadStream(filePath)
const destination = createWriteStream(outputPath)

try {
  await pipeline(source, gzip, destination)
  return outputPath
} catch (error) {
  throw new Error(`Error during compression: ${error.message}`)
}
}

/*
 *
 * #2
 *
 * Технічне завдання для розробки функції "decompressFile"
 *
 * Задача:
 * Розробити асинхронну функцію, яка використовує алгоритм Gzip для розпакування заданого компресованого файлу у вказане місце збереження. Функція має генерувати унікальне ім'я для розпакованого файлу, якщо файл з таким іменем вже існує, та забезпечувати високий рівень надійності та безпеки процесу розпакування.
 *
 * Функціональні вимоги:
 * 1. Вхідні параметри:
 *  - `compressedFilePath`: Шлях до компресованого файлу, який потрібно розпакувати.
 *  - `destinationFilePath`: Шлях, де буде збережено розпакований файл.
 *
 * 2. Вихідні дані:
 *  - Функція повертає шлях до розпакованого файлу як рядок.
 *
 * 3. Унікальність:
 *  - Перевірка наявності існуючих файлів з таким самим іменем і створення унікального імені файлу шляхом додавання номера до існуючого імені, якщо необхідно.
 *
 * 4. Обробка помилок:
 *  - Функція має ідентифікувати та коректно обробляти помилки читання, запису та доступу до файлів.
 *  - В разі помилок, функція має повертати відповідні повідомлення про помилку або коди помилок,
 *    що дозволяють користувачеві або іншим частинам програми адекватно реагувати на такі ситуації.
 *
 * Технічні вимоги:
 * - Використання сучасних можливостей JavaScript (ES6+), включаючи асинхронні функції, стрімове API Node.js, та ESM для легкої інтеграції та тестування.
 * - Функція має бути написана таким чином, щоб її можна було експортувати та використовувати в інших частинах програми або тестових сценаріях.
 * - Забезпечення документації коду з описом параметрів, процесу роботи, виключень, які можуть бути сгенеровані, та прикладами використання.
 * - Підготовка функції для можливості легкого мокування та тестування за допомогою JEST.
 *
 */

async function decompressFile(compressedFilePath, destinationFilePath) {
  if (!compressedFilePath || typeof compressedFilePath !== 'string') {
    throw new Error('Invalid compressed file path')
  }
  if (!destinationFilePath || typeof destinationFilePath !== 'string') {
    throw new Error('Invalid destination file path')
  }

  if (!destinaionFilePath || typeof destinationFilePath !== 'string') {
    throw new Error('Invalid destination file path')
  }

  if (!compressedFilePath.endsWith('.gz')) {
    throw new Error('Invalid compressed file format. Expected a .gz file')
  }
  try {
    await access(compressedFilePath)
  } catch (error) {
    throw new Error(`Compressed file not found: ${compressedFilePath}`)
  }
  const { dir, name, ext} = path.parse(destinationFilePath)
  let outpath = destinationFilePath
  let counter = 1

while (true) {
  try {
    await access(outpath)
    outpath = path.join(dir, `${name}(${counter})${ext}`)
    counter++ 
  } catch (error) {
    break
  }
}
  const gunzip = createGunzip()
  const source = createReadStream(compressedFilePath)
  const destination = createWriteStream(outpath)
  try {
    await pipeline(source, gunzip, destination)
    return outpath
  } catch (error) {
    throw new Error(`Error during decompression: ${error.message}`)
  }
} 


// ! Перевірка роботи функцій стиснення та розпакування файлів
// async function performCompressionAndDecompression() {
//   try {
//     const compressedResult = await compressFile('./files/source.txt')
//     console.log(compressedResult)
//     const decompressedResult = await decompressFile(compressedResult, './files/source_decompressed.txt')
//     console.log(decompressedResult)
//   } catch (error) {
//     console.error('Error during compression or decompression:', error)
//   }
// }
// performCompressionAndDecompression()

export { compressFile, decompressFile };
