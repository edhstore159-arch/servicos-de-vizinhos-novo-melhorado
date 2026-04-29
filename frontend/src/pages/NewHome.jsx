import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Search, Wrench, MapPin, Camera, ArrowLeft, Loader2, Building2, User, Briefcase, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NewHome = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [language, setLanguage] = useState('PT');
  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    lastName: '',
    commercialName: '',
    profession: '',
    email: '',
    password: '',
    location: '',
    phone: '',
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotCode, setForgotCode] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  const resetForgot = () => {
    setForgotStep(1);
    setForgotEmail('');
    setForgotCode('');
    setForgotNewPassword('');
    setError('');
    setForgotSuccess('');
  };

  const handleForgotRequest = async () => {
    if (!forgotEmail) { setError('Digite seu email'); return; }
    setIsLoading(true);
    setError('');
    try {
      const res = await (await import('../lib/api')).default.post('/auth/forgot-password', { email: forgotEmail });
      setForgotSuccess(res.data.hint || 'Código enviado!');
      setForgotStep(2);
    } catch (err) {
      setError(err.response?.data?.detail || 'Email não encontrado');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!forgotCode || !forgotNewPassword) { setError('Preencha todos os campos'); return; }
    if (forgotNewPassword.length < 6) { setError('A senha deve ter pelo menos 6 caracteres'); return; }
    setIsLoading(true);
    setError('');
    try {
      await (await import('../lib/api')).default.post('/auth/reset-password', {
        email: forgotEmail, code: forgotCode, new_password: forgotNewPassword
      });
      setForgotStep(3);
      setForgotSuccess('Senha alterada com sucesso!');
    } catch (err) {
      setError(err.response?.data?.detail || 'Código inválido');
    } finally {
      setIsLoading(false);
    }
  };

  const resetRegister = () => {
    setStep(1);
    setAccountType('');
    setRegisterData({ name: '', lastName: '', commercialName: '', profession: '', email: '', password: '', location: '', phone: '' });
    setAcceptTerms(false);
    setError('');
  };

  const handleRegister = async () => {
    if (!registerData.email || !registerData.password) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }
    if (!acceptTerms) {
      setError('Aceite os termos de uso para continuar');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const fullName = accountType === 'particular'
        ? `${registerData.name} ${registerData.lastName}`.trim()
        : registerData.commercialName || registerData.name;
      await register({
        name: fullName || 'Usuário',
        email: registerData.email,
        password: registerData.password,
        location: registerData.location || 'Brasil',
        phone: registerData.phone || undefined,
      });
      setShowCreateAccount(false);
      resetRegister();
      navigate('/feed');
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!loginData.email || !loginData.password) {
      setError('Preencha email e senha');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await login(loginData.email, loginData.password);
      setShowLogin(false);
      navigate('/feed');
    } catch (err) {
      // Provide specific feedback based on the error type
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        setError('Não foi possível conectar ao servidor. Verifique sua conexão ou a configuração do backend.');
      } else if (err.response?.status === 0 || err.message?.includes('CORS')) {
        setError('Erro de CORS: o servidor não está autorizando este domínio.');
      } else {
        setError('Email ou senha incorretos');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const selectAccountType = (type) => {
    setAccountType(type);
    setStep(2);
    setError('');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-green-400 rounded-lg flex items-center justify-center text-white font-bold">
              S
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold">
                <span className="text-pink-500">servi</span>
                <span className="text-green-500">vizinhos</span>
              </span>
              <span className="text-xs text-gray-500 uppercase">Facilitador de Projetos</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-sm">
              {['PT', 'FR', 'EN', 'ES'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2 py-1 rounded ${language === lang ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-600 hover:text-green-600'}`}
                >
                  {lang}
                </button>
              ))}
            </div>
            <Button variant="outline" onClick={() => { setShowLogin(true); setError(''); }} className="border-gray-300" data-testid="header-login-btn">
              Entrar
            </Button>
            <Button onClick={() => { setShowCreateAccount(true); resetRegister(); }} className="bg-gray-900 hover:bg-gray-800 text-white" data-testid="header-register-btn">
              Cadastrar-se
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="mb-8">
              <div className="inline-flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full mb-4">
                <span className="text-green-600 font-semibold flex items-center space-x-1">
                  <span className="text-yellow-500">&#9733;</span>
                  <span>4.8/5</span>
                </span>
                <span className="text-gray-600 text-sm">420k avaliações</span>
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Prestação de serviços
              <br />
              <span className="text-green-600">entre vizinhos</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Milhares de pessoas e profissionais perto de você prontos para ajudar
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button onClick={() => { setShowCreateAccount(true); resetRegister(); }} className="bg-gray-900 hover:bg-gray-800 text-white h-14 px-8 text-base">
                <Search className="w-5 h-5 mr-2" />
                Preciso de um serviço
              </Button>
              <Button onClick={() => { setShowCreateAccount(true); resetRegister(); }} variant="outline" className="border-2 border-green-500 text-green-600 hover:bg-green-50 h-14 px-8 text-base">
                <Wrench className="w-5 h-5 mr-2" />
                Quero oferecer serviços
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1555955207-cf6fba0f1f57?w=1200&h=800&fit=crop&q=90" alt="Vizinhos ajudando em serviços" className="w-full h-[500px] object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* App Store Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-center space-x-4 bg-white p-6 rounded-xl shadow-sm">
              <div className="text-4xl">&#9654;</div>
              <div>
                <p className="font-semibold text-lg mb-1">Google Play</p>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-yellow-500">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
                  <span className="font-bold">4.6/5</span>
                </div>
                <p className="text-sm text-gray-600">47.154 avaliações</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-white p-6 rounded-xl shadow-sm">
              <div className="text-4xl">&#63743;</div>
              <div>
                <p className="font-semibold text-lg mb-1">App Store</p>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-yellow-500">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
                  <span className="font-bold">4.6/5</span>
                </div>
                <p className="text-sm text-gray-600">66.000 avaliações</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-green-500 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <p className="text-white text-lg font-medium mb-4 md:mb-0">
            Conecte-se para aproveitar ao máximo o ServiVizinhos
          </p>
          <div className="flex items-center space-x-4">
            <Button onClick={() => { setShowCreateAccount(true); resetRegister(); }} className="bg-white text-green-600 hover:bg-gray-100 px-8">
              Cadastrar-se
            </Button>
            <button onClick={() => { setShowLogin(true); setError(''); }} className="text-white underline hover:no-underline">
              Já tem conta? Entrar
            </button>
          </div>
        </div>
      </div>

      {/* ===== MULTI-STEP REGISTER MODAL ===== */}
      <Dialog open={showCreateAccount} onOpenChange={(open) => { setShowCreateAccount(open); if (!open) resetRegister(); }}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto p-0">
          <DialogTitle className="sr-only">Criar conta</DialogTitle>
          <div className="p-6">
            {/* Header with back and close */}
            <div className="flex items-center justify-between mb-6">
              {step > 1 ? (
                <button onClick={() => { setStep(1); setError(''); }} className="text-gray-600 hover:text-gray-900" data-testid="register-back-btn">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              ) : <div />}
            </div>

            {step === 1 && (
              <>
                <h2 className="text-xl font-bold text-center mb-8" data-testid="register-step1-title">
                  Me inscrevo como:
                </h2>

                <div className="space-y-3 mb-6">
                  <button
                    data-testid="register-type-particular"
                    onClick={() => selectAccountType('particular')}
                    className="w-full flex items-center justify-center gap-3 h-14 border-2 border-gray-200 rounded-xl text-base font-medium hover:border-green-500 hover:bg-green-50 transition-all"
                  >
                    <User className="w-5 h-5" />
                    Particular
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-sm text-gray-500">ou</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <div className="space-y-3">
                  <button
                    data-testid="register-type-autonomo"
                    onClick={() => selectAccountType('autonomo')}
                    className="w-full flex items-center justify-center gap-3 h-14 border-2 border-gray-200 rounded-xl text-base font-medium hover:border-green-500 hover:bg-green-50 transition-all"
                  >
                    <Briefcase className="w-5 h-5" />
                    Autônomo
                  </button>
                  <button
                    data-testid="register-type-empresa"
                    onClick={() => selectAccountType('empresa')}
                    className="w-full flex items-center justify-center gap-3 h-14 border-2 border-gray-200 rounded-xl text-base font-medium hover:border-green-500 hover:bg-green-50 transition-all"
                  >
                    <Building2 className="w-5 h-5" />
                    Empresa
                  </button>
                </div>

                <p className="text-center text-sm text-gray-400 mt-8">Etapa 1/2</p>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-xl font-bold text-center mb-6">Criar conta</h2>

                {error && (
                  <div data-testid="register-error" className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>
                )}

                <div className="space-y-4">
                  {accountType === 'particular' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-gray-500">Nome</Label>
                        <Input
                          data-testid="register-name"
                          placeholder="Nome"
                          value={registerData.name}
                          onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                          className="h-12 border-gray-300"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Sobrenome</Label>
                        <Input
                          data-testid="register-lastname"
                          placeholder="Sobrenome"
                          value={registerData.lastName}
                          onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                          className="h-12 border-gray-300"
                        />
                      </div>
                    </div>
                  )}

                  {(accountType === 'autonomo' || accountType === 'empresa') && (
                    <div>
                      <Label className="text-xs text-gray-500">Nome comercial</Label>
                      <Input
                        data-testid="register-commercial-name"
                        placeholder="Nome comercial"
                        value={registerData.commercialName}
                        onChange={(e) => setRegisterData({ ...registerData, commercialName: e.target.value })}
                        className="h-12 border-gray-300"
                      />
                    </div>
                  )}

                  {accountType === 'empresa' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-gray-500">Nome do dirigente</Label>
                        <Input
                          placeholder="Nome"
                          value={registerData.name}
                          onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                          className="h-12 border-gray-300"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Sobrenome do dirigente</Label>
                        <Input
                          placeholder="Sobrenome"
                          value={registerData.lastName}
                          onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                          className="h-12 border-gray-300"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <Label className="text-xs text-gray-500">Profissão</Label>
                    <Input
                      data-testid="register-profession"
                      placeholder="Profissão"
                      value={registerData.profession}
                      onChange={(e) => setRegisterData({ ...registerData, profession: e.target.value })}
                      className="h-12 border-gray-300"
                    />
                  </div>

                  <div>
                    <Label className="text-xs text-gray-500">Endereço</Label>
                    <Input
                      data-testid="register-location"
                      placeholder="Endereço postal"
                      value={registerData.location}
                      onChange={(e) => setRegisterData({ ...registerData, location: e.target.value })}
                      className="h-12 border-gray-300"
                    />
                  </div>

                  <div>
                    <Label className="text-xs text-gray-500">Celular</Label>
                    <Input
                      data-testid="register-phone"
                      placeholder="Celular"
                      value={registerData.phone}
                      onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                      className="h-12 border-gray-300"
                    />
                  </div>

                  <div>
                    <Label className="text-xs text-gray-500">E-mail</Label>
                    <Input
                      data-testid="register-email"
                      type="email"
                      placeholder="E-mail"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      className="h-12 border-gray-300"
                      required
                    />
                  </div>

                  <div className="relative">
                    <Label className="text-xs text-gray-500">Senha</Label>
                    <Input
                      data-testid="register-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Senha"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      className="h-12 border-gray-300 pr-10"
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-8">
                      {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                    </button>
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input type="checkbox" className="mt-1 rounded border-gray-300" />
                      <span className="text-xs text-gray-600">Receber informações dos nossos parceiros</span>
                    </label>
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="mt-1 rounded border-gray-300"
                        data-testid="register-accept-terms"
                      />
                      <span className="text-xs text-gray-600">
                        Aceito as{' '}
                        <span className="text-green-600 underline cursor-pointer">condições gerais de venda e utilização</span>
                      </span>
                    </label>
                  </div>

                  <Button
                    data-testid="register-submit"
                    onClick={handleRegister}
                    disabled={isLoading}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white h-14 text-base mt-2"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Inscrever-me'}
                  </Button>
                </div>

                <p className="text-center text-sm text-gray-400 mt-4">Etapa 2/2</p>

                <div className="text-center mt-3">
                  <button onClick={() => { setShowCreateAccount(false); setShowLogin(true); setError(''); resetRegister(); }} className="text-sm text-green-600 hover:underline">
                    Já tem conta? Entrar
                  </button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ===== LOGIN MODAL ===== */}
      <Dialog open={showLogin} onOpenChange={(open) => { if (!isLoading) { setShowLogin(open); if (!open) setError(''); } }}>
        <DialogContent className="max-w-md" onInteractOutside={(e) => { if (isLoading) e.preventDefault(); }}>
          <DialogTitle className="sr-only">Entrar</DialogTitle>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-center mb-6">Que bom te ver de volta!</h2>
            {error && (
              <div data-testid="login-error" className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label className="text-xs text-gray-500">E-mail</Label>
                <Input
                  data-testid="login-email"
                  type="email"
                  placeholder="E-mail"
                  className="h-12"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
              </div>
              <div className="relative">
                <Label className="text-xs text-gray-500">Senha</Label>
                <Input
                  data-testid="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Senha"
                  className="h-12 pr-10"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-8">
                  {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                </button>
              </div>
              <Button data-testid="login-submit" type="submit" disabled={isLoading} className="w-full bg-gray-900 hover:bg-gray-800 h-12">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Entrar'}
              </Button>
            </form>
            <div className="text-center mt-4">
              <button
                data-testid="forgot-password-btn"
                onClick={() => { setShowLogin(false); setShowForgotPassword(true); resetForgot(); }}
                className="text-sm text-gray-500 hover:underline"
              >
                Esqueceu a senha?
              </button>
            </div>
            <div className="text-center mt-2">
              <button onClick={() => { setShowLogin(false); setShowCreateAccount(true); setError(''); resetRegister(); }} className="text-sm text-green-600 hover:underline">
                Não tem conta? Criar conta
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ===== FORGOT PASSWORD MODAL ===== */}
      <Dialog open={showForgotPassword} onOpenChange={(open) => { if (!isLoading) { setShowForgotPassword(open); if (!open) resetForgot(); } }}>
        <DialogContent className="max-w-md">
          <DialogTitle className="sr-only">Recuperar senha</DialogTitle>
          <div className="p-6">
            {forgotStep === 1 && (
              <>
                <button onClick={() => { setShowForgotPassword(false); setShowLogin(true); resetForgot(); }} className="text-gray-500 hover:text-gray-700 mb-4">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-bold text-center mb-2">Recuperar senha</h2>
                <p className="text-sm text-gray-500 text-center mb-6">Digite seu email para receber o código de verificação</p>
                {error && <div data-testid="forgot-error" className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}
                <div className="space-y-4">
                  <Input data-testid="forgot-email" type="email" placeholder="Seu email" className="h-12" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} />
                  <Button data-testid="forgot-submit" onClick={handleForgotRequest} disabled={isLoading} className="w-full bg-green-500 hover:bg-green-600 h-12 text-white">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enviar código'}
                  </Button>
                </div>
              </>
            )}

            {forgotStep === 2 && (
              <>
                <h2 className="text-xl font-bold text-center mb-2">Verificar código</h2>
                {forgotSuccess && <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg mb-4">{forgotSuccess}</div>}
                {error && <div data-testid="reset-error" className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}
                <p className="text-sm text-gray-500 text-center mb-6">Verifique o código enviado para <strong>{forgotEmail}</strong></p>
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs text-gray-500">Código de verificação</Label>
                    <Input data-testid="reset-code" placeholder="000000" className="h-12 text-center text-lg tracking-widest" maxLength={6} value={forgotCode} onChange={(e) => setForgotCode(e.target.value.replace(/\D/g, ''))} />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Nova senha</Label>
                    <Input data-testid="reset-new-password" type="password" placeholder="Nova senha (mín. 6 caracteres)" className="h-12" value={forgotNewPassword} onChange={(e) => setForgotNewPassword(e.target.value)} />
                  </div>
                  <Button data-testid="reset-submit" onClick={handleResetPassword} disabled={isLoading} className="w-full bg-green-500 hover:bg-green-600 h-12 text-white">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Alterar senha'}
                  </Button>
                </div>
              </>
            )}

            {forgotStep === 3 && (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold mb-2">Senha alterada!</h2>
                <p className="text-sm text-gray-500 mb-6">Sua senha foi alterada com sucesso. Faça login com a nova senha.</p>
                <Button data-testid="back-to-login-btn" onClick={() => { setShowForgotPassword(false); setShowLogin(true); resetForgot(); }} className="bg-green-500 hover:bg-green-600 text-white px-8">
                  Fazer login
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewHome;
