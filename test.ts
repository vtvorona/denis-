type Slave = {
    id: number,
    city_id: number;
    name: string,
    surname: string,
    patronymic: string,
    age: number,
    floor: string,
    status: string,
}

type City = {
    id: number,
    country_id: number,
    name: string,
    slaves: Slave[],
}

type Country = {
    id: number,
    name: string,
    description: string,
    cities: City[],
}

let slaves: Slave[] = [];
let cities: City[] = [];
let countries: Country[] = [];

let countriesMap = new Map();
let citiesMap = new Map();

let firstCount = 0;
let secondCount = 0;
let thirdCount = 0;

let addCountry = (name: string, description: string) => {

    let country: Country = {
        id: firstCount,
        name: name,
        description: description,
        cities: [],
    }

    countries.push(country);
    countriesMap.set(country.name, firstCount)

    firstCount++;
}

let addCity = (country_id: number, name: string) => {

    var city: City = {
        id: secondCount,
        country_id: country_id,
        name: name,
        slaves: [],
    }

    cities.push(city);
    citiesMap.set(city.name, secondCount);
    secondCount++;
}


let addSlave = (cityId: number, name: string, surname: string, patronymic: string, age: number, floor: string, status: string) => {

    let slave: Slave = {
        id: thirdCount,
        city_id: cityId,
        name: name,
        surname: surname,
        patronymic: patronymic,
        age: age,
        floor: floor,
        status: status,
    }

    slaves.push(slave);

    thirdCount++
}

function getCountry(
    countryName: string,
): Country {
    let country = countries[countriesMap.get(countryName)];
    return {
        ...country,
        cities: cities.filter((city) => {
            city.slaves = slaves.filter(slave => slave.city_id == city.id && city.country_id == country.id);
            return city.country_id == country.id;
        })
    }
}

function evacuate(
    countryName: string,
    oldCityName: string,
    newCityName: string,
) {
    let country = getCountry(countryName);
    let oldCityId = citiesMap.get(oldCityName);
    let newCityId = citiesMap.get(newCityName);

    return {
        ...country,
        cities: country.cities?.map((city) => ({
            ...city,
            slaves:
                city.id === oldCityId
                    ? []
                    : city.id === newCityId
                        ? [
                            ...city.slaves,
                            ...(country.cities.find((city) => city.id === oldCityId)?.slaves ?? []),                                         // и затем обращаемся 
                        ]
                        : city.slaves
        })),
    };
}

function getUnderaged(country: Country): Slave[] {
    return country.cities.flatMap((city) => city.slaves.filter(slave => slave.age < 18))
}

function getStatusWorkers(country: Country):Slave[] {
    return country.cities.flatMap((city) => city.slaves.filter(slave => {slave.status == "worker"}))
}

// Добавление стран
addCountry("Казахстан", "Крутая супер страна");
addCountry("Россия", "Крутая большая супер страна");
addCountry("Китай", "酷超级国家");

// Добавление городов для Казахстана
addCity(0, "Астана");
addCity(0, "Алматы");

// Добавление городов для России
addCity(1, "Москва");
addCity(1, "Санкт-Петербург");

// Добавление городов для Китая
addCity(2, "Пекин");
addCity(2, "Шанхай");

// Добавление жителей в Астану
addSlave(0, "Алексей", "Иванов", "Сергеевич", 25, "male", "worker");
addSlave(0, "Динара", "Курманова", "Асылбековна", 3, "female", "free");
addSlave(0, "Ержан", "Нурмагамбетов", "Оспанович", 40, "male", "worker");

// Добавление жителей в Алматы
addSlave(1, "Марат", "Ахметов", "Жумагалиевич", 35, "male", "free");
addSlave(1, "Айжан", "Турсынова", "Серикбаевна", 8, "female", "worker");
addSlave(1, "Самат", "Кенжебаев", "Нурланович", 45, "male", "worker");

// Добавление жителей в Москву
addSlave(2, "Иван", "Сидоров", "Александрович", 33, "male", "worker");
addSlave(2, "Мария", "Козлова", "Владимировна", 7, "female", "free");
addSlave(2, "Сергей", "Петров", "Иванович", 50, "male", "worker");

// Добавление жителей в Санкт-Петербург
addSlave(3, "Олег", "Федоров", "Николаевич", 29, "male", "worker");
addSlave(3, "Анна", "Васильева", "Петровна", 26, "female", "free");
addSlave(3, "Дмитрий", "Смирнов", "Сергеевич", 8, "male", "worker");

// Добавление жителей в Пекин
addSlave(4, "Ли", "Вэй", "Жангович", 32, "male", "worker");
addSlave(4, "Мэй", "Фэн", "Хуановна", 25, "female", "free");
addSlave(4, "Чжан", "Хао", "Чэнович", 41, "male", "worker");

// Добавление жителей в Шанхай
addSlave(5, "Ван", "Юй", "Лэович", 36, "male", "worker");
addSlave(5, "Сяо", "Лин", "Мэйовна", 24, "female", "free");
addSlave(5, "Чэнь", "Бо", "Фэнович", 39, "male", "worker");

console.log(evacuate("Казахстан", "Астана", "Алматы"));

console.log(getUnderaged(getCountry("Россия")));

console.log(getStatusWorkers(getCountry("Россия")));