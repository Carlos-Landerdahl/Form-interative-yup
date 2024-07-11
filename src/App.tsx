import './App.css'
import * as yup from 'yup'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useState } from 'react'
import { phoneNumber } from './utils/phoneRegex'
import { normalizePhoneNumber } from './utils/normalizePhone'

// Validação inputs
const schema = yup.object({
  name: yup
    .string()
    .required('Nome é obrigatório')
    .min(2, 'Necessário pelo menos 2 caracteres'),
  email: yup.string().required('Email é obrigatório').email('Email inválido'),
  password: yup
    .string()
    .required('Senha é obrigatória')
    .min(2, 'Necessário pelo menos 2 caracteres'),
  passwordCheck: yup
    .string()
    .required('Confirmação de senha é obrigatória')
    .oneOf([yup.ref('password')], 'Senhas não coincidem'),
  phone: yup.string().matches(phoneNumber, 'Telefone inválido'),
  cep: yup
    .string()
    .required('CEP é obrigatório')
    .matches(/^\d{8}$/, 'Formato de CEP inválido'),
  logradouro: yup.string().required('Logradouro é obrigatório'),
  cidade: yup.string().required('Cidade é obrigatório'),
})
// Transformando meu schema em um type
type FormData = yup.InferType<typeof schema>

function App() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const [errorCep, setErrorCep] = useState('')

  // Verfica o valor dos inputs a cada alteração
  const phoneValue = watch('phone')
  const cepValue = watch('cep')

  useEffect(() => {
    async function fetchDataCep(cep: string) {
      try {
        if (cep.length === 8) {
          const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
          const data = await res.json()
          if (data.erro || !data.logradouro || !data.localidade) {
            setErrorCep('CEP não encontrado')
          } else {
            setValue('logradouro', data.logradouro)
            setValue('cidade', data.localidade)
            setErrorCep('')
            // console.log(data)
          }
        } else {
          setErrorCep('')
        }
      } catch (error) {
        setErrorCep('Erro ao obter dados do CEP')
      }
    }

    setValue('phone', normalizePhoneNumber(phoneValue))
    fetchDataCep(cepValue)
  }, [phoneValue, setValue, cepValue])

  const onSubmit: SubmitHandler<FormData> = (data) => {
    window.alert('Conta criada com sucesso')
    console.log(data)
    reset()
  }

  return (
    <div className="container">
      <div className="title">
        <h1>Formulário</h1>
        <p>React Hook Form & YUP</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset>
          <label htmlFor="name">
            Name <input type="text" id="name" {...register('name')} />
          </label>
          {errors?.name && (
            <p role="alert" className="error">
              {errors.name.message}
            </p>
          )}
          {/* ------------ */}
          <label htmlFor="email">
            Email <input type="text" id="email" {...register('email')} />
          </label>
          {errors?.email && (
            <p role="alert" className="error">
              {errors.email.message}
            </p>
          )}
          {/* ------------ */}
          <label htmlFor="phone">
            Phone
            <input
              type="tel"
              id="phone"
              {...register('phone')}
              placeholder="(99) 99999-9999"
            />
          </label>
          {errors?.phone && (
            <p role="alert" className="error">
              {errors.phone.message}
            </p>
          )}
          {/* ------------ */}
          <label htmlFor="cep">
            Cep
            <input
              type="text"
              maxLength={8}
              id="cep"
              {...register('cep')}
              placeholder="99999-999"
            />
          </label>
          {(errorCep || errors?.cep) && (
            <p className="error" role="alert">
              {errorCep || errors?.cep?.message}
            </p>
          )}
          {/* ------------ */}
          <label htmlFor="logradouro">
            Logradouro
            <input
              disabled
              type="text"
              id="logradouro"
              {...register('logradouro')}
            />
          </label>
          {/* ------------ */}
          <label htmlFor="cidade">
            Cidade
            <input disabled type="text" id="cidade" {...register('cidade')} />
          </label>
          {/* ------------ */}
          <label htmlFor="password">
            Password
            <input type="password" id="password" {...register('password')} />
          </label>
          {errors?.password && (
            <p role="alert" className="error">
              {errors.password.message}
            </p>
          )}
          {/* ------------ */}
          <label htmlFor="passwordCheck">
            Confirm password
            <input
              type="password"
              id="passwordCheck"
              {...register('passwordCheck')}
            />
          </label>
          {errors?.passwordCheck && (
            <p role="alert" className="error">
              {errors.passwordCheck.message}
            </p>
          )}
          {/* ------------ */}
          <button type="submit" className="btnSend">
            Send
          </button>
        </fieldset>
      </form>
    </div>
  )
}

export default App
