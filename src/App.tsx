import { useState, useEffect } from 'react'
import './App.css'
import { useQuery } from 'react-query'

function App() {
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedYear, setSelectedYear] = useState('')

  const handleBrandChange = (value: string) => {
    setSelectedBrand(value)
  }

  const handleModelChange = (value: string) => {
    setSelectedModel(value)
  }

  const handleYearChange = (value: string) => {
    setSelectedYear(value)
  }

  return (
    <>
      <Navbar/>
      <div className="min-h-[80vh] text-center flex flex-col justify-center items-center w-full">
        <Brand handleBrandChange={handleBrandChange} />
        <Model brand={selectedBrand} handleModelChange={handleModelChange} />
        <Year brand={selectedBrand} model={selectedModel} handleYearChange={handleYearChange} />
        <Vehicle brand={selectedBrand} model={selectedModel} year={selectedYear} />
      </div>
      <Footer/>
    </>
  )
}

type BrandProps = {
  handleBrandChange: (value: string) => void
}
function Brand({ handleBrandChange }: BrandProps) {
  const [selectedValue, setSelectedValue] = useState('')

  const { data, isLoading: isBrandsLoading, error: brandsError }: any = useQuery('brands', () => {
      return fetch('https://parallelum.com.br/fipe/api/v1/carros/marcas').then((res) => res.json())
    }
  )
  
  useEffect(() => {
    if (Array.isArray(data) && selectedValue === '') {
      handleBrandChange(data[0].codigo);
    }
  }, [data, handleBrandChange]);

  if (isBrandsLoading) {
    return <Spinner/>
  }

  if (brandsError) {
    return <div>Error: {brandsError.message}</div>
  }

  return (
    <div>
      <h2 className="my-5 text-xl font-bold">Brand:</h2>
      <select className="py-3 px-4 pr-9 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" defaultValue={data[0].codigo} onChange={ (event) => {
        setSelectedValue(event.target.value)
        handleBrandChange(event.target.value)
      } }>
        {data && data.map((brand: any) => (
          <option key={brand.codigo} value={brand.codigo}>{brand.nome}</option>
        ))}
      </select>
    </div>
  )
}

function Model({ brand, handleModelChange }: any) {
  const [selectedValue, setSelectedValue] = useState('')

  const { data, isLoading: isModelsLoading, error: modelsError }: any = useQuery(['models', brand], () =>
    fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${brand}/modelos`).then((res) => res.json())
  )

  useEffect(() => {
    if (typeof data === 'object' && selectedValue === '') {
      handleModelChange(data.modelos[0].codigo);
    }
  }, [data, handleModelChange]);

  useEffect(() => {
    setSelectedValue('')
  }, [brand])

  if (isModelsLoading) {
    return <Spinner/>
  }

  if (modelsError) {
    return <div>Error: {modelsError.message}</div>
  }

  return (
    <div>
      <h2 className="my-5 text-xl font-bold">Model:</h2>
      <select className="py-3 px-4 pr-9 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" defaultValue={data.modelos[0].codigo} onChange={ (event) => {
        setSelectedValue(event.target.value)
        handleModelChange(event.target.value)
      } }>
        {data.modelos && data.modelos.map((model: any) => (
          <option key={model.codigo} value={model.codigo}>{model.nome}</option>
        ))}
      </select>
    </div>
  )
}

function Year({ brand, model, handleYearChange }: any) {
  const [selectedValue, setSelectedValue] = useState('')

  const { data, isLoading: isModelsLoading, error: modelsError }: any = useQuery(['years', brand, model], () =>
    fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${brand}/modelos/${model}/anos`).then((res) => res.json())
  )
  
  useEffect(() => {
    if (Array.isArray(data) && selectedValue === '') {
      handleYearChange(data[0].codigo);
    }
  }, [data, handleYearChange]);

  useEffect(() => {
    setSelectedValue('')
  }, [brand, model])

  if (isModelsLoading) {
    return <Spinner/>
  }

  if (modelsError) {
    return <div>Error: {modelsError.message}</div>
  }

  return (
    <div>
      <h2 className="my-5 text-xl font-bold">Year:</h2>
      <select className="py-3 px-4 pr-9 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" defaultValue={data[0].codigo} onChange={ (event) => {
        setSelectedValue(event.target.value)
        handleYearChange(event.target.value)
      } }>
        {data && data.map((year: any) => (
          <option key={year.codigo} value={year.codigo}>{year.nome}</option>
        ))}
      </select>
    </div>
  )
}

function Vehicle({ brand, model, year }: any) {
  const { data, isLoading: isVehicleLoading, error: vehicleError }: any = useQuery(['vehicles', brand, model, year], () =>
    fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${brand}/modelos/${model}/anos/${year}`).then((res) => res.json())
  )

  if (isVehicleLoading) {
    return <Spinner/>
  }

  if (vehicleError) {
    return <div>Error: {vehicleError.message}</div>
  }

  return (
    <>
      <List
        title={data.Modelo}
        price={data.Valor}
        brand={data.Marca}
        year={data.AnoModelo}
        fuel={data.Combustivel}
        fipeCode={data.CodigoFipe}
        referenceMonth={data.MesReferencia}
        fuelAcronym={data.SiglaCombustivel}
      />
    </>
  )
}

function Spinner() {
  return (
    <div className="my-5 animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-gray-400 rounded-full" role="status" aria-label="loading">
      <span className="sr-only">Loading...</span>
    </div>
  )
}

function List({ title, price, brand, year, fuel, fipeCode, referenceMonth, fuelAcronym}: any) {
  return (
    <>
      <h1 className="my-5 ml-7 text-xl font-bold">{title}</h1>
      <ul className="mx-5 max-w-xs flex flex-col">
        <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm font-medium odd:bg-gray-100 bg-white border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:odd:bg-slate-800 dark:bg-gray-800 dark:border-gray-700 dark:text-white">
          Price: {price}
        </li>
        <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm font-medium odd:bg-gray-100 bg-white border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:odd:bg-slate-800 dark:bg-gray-800 dark:border-gray-700 dark:text-white">
          Brand: {brand}
        </li>
        <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm font-medium odd:bg-gray-100 bg-white border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:odd:bg-slate-800 dark:bg-gray-800 dark:border-gray-700 dark:text-white">
          Year: {year}
        </li>
        <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm font-medium odd:bg-gray-100 bg-white border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:odd:bg-slate-800 dark:bg-gray-800 dark:border-gray-700 dark:text-white">
          Fuel: {fuel}
        </li>
        <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm font-medium odd:bg-gray-100 bg-white border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:odd:bg-slate-800 dark:bg-gray-800 dark:border-gray-700 dark:text-white">
          FIPE Code: {fipeCode}
        </li>
        <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm font-medium odd:bg-gray-100 bg-white border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:odd:bg-slate-800 dark:bg-gray-800 dark:border-gray-700 dark:text-white">
          Month of reference: {referenceMonth}
        </li>
        <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm font-medium odd:bg-gray-100 bg-white border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:odd:bg-slate-800 dark:bg-gray-800 dark:border-gray-700 dark:text-white">
          Fuel Acronym: {fuelAcronym}
        </li>
      </ul>
    </>
  )
}

function Navbar() {
  return (
    <header className="flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full bg-white text-sm py-4 dark:bg-gray-800">
      <nav className="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between" aria-label="Global">
        <a className="flex-none text-xl font-semibold dark:text-white" href="#">Info Cars</a>
        <div className="flex flex-row items-center gap-5 mt-5 sm:justify-end sm:mt-0 sm:pl-5">
          <a className="font-medium text-gray-600 hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-500" href="https://deividfortuna.github.io/fipe/" target="_blank">API</a>
        </div>
      </nav>
    </header>
  )
}

function Footer() {
  return (
    <footer className="text-gray-600 body-font bg-gray-300 sm:fixed sm:bottom-0 sm:left-0 sm:w-full">
      <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
        <a className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
          <span className="ml-3 text-xl">Info Cars</span>
        </a>
        <p className="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">© {new Date().getFullYear()} Info Cars —
          <a href="https://wdpedroborges.github.io/" className="text-gray-600 ml-1" rel="noopener noreferrer" target="_blank">@wdpedroborges</a>
        </p>
        <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
          <a className="ml-3 text-gray-500" href="https://github.com/wdpedroborges" target="_blank">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-github" viewBox="0 0 16 16">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
            </svg>
          </a>
          <a className="ml-3 text-gray-500" href="https://www.linkedin.com/in/pedroborges11/" target="_blank">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-linkedin" viewBox="0 0 16 16">
              <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
            </svg>
          </a>
        </span>
      </div>
    </footer>
  )
}

export default App