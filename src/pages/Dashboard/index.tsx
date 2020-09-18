import React, { useState, useEffect, FormEvent } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../services/api';

import logoImg from '../../assets/logo.svg';
import { Title, Form, Repositories, Error } from './styles';
import { TriangleConfiguration } from 'polished/lib/types/triangleConfiguration';

interface Repository {
    full_name: string;
    description: string;
    owner: {
        login: TriangleConfiguration;
        avatar_url: string;
    };
}

const Dashboard: React.FC = () => {
    const [newRepo, setNewRepo] = useState('');
    const [inputError, setInputError] = useState('');
    const [repositories, setRepositories] = useState<Repository[]>(() => {
        const storagedRepositories = localStorage.getItem('@GithubExplorer:repositories');
        if (storagedRepositories) {
            return JSON.parse(storagedRepositories)
        }
        return [];
    });

    useEffect(() => {
        localStorage.setItem('@GithubExplorer:repositories', JSON.stringify(repositories));
    }, [repositories]);

    async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();
        if(!newRepo) {
            setInputError('Digite o autor/nome do repositório')
            return;
        }
        
        try {
            const response = await api.get(`repos/${newRepo}`);
        
            const repository = response.data;
    
            setRepositories([...repositories, repository]);
            setNewRepo('');
            setInputError('');
        } catch(err) {
            setInputError('Erro na busca pelo repositório')
        }
    }

    return (
        <>
            <img src={logoImg} alt="github explorer" />
            <Title>Explore repositórios no Github</Title>

            <Form hasError={Boolean(inputError)} onSubmit={handleAddRepository} >
                <input 
                    value={newRepo}
                    onChange={(e) => setNewRepo(e.target.value)}
                    placeholder="Autor/Nome do repositório" />
                <button type="submit">Pesquisar</button>
            </Form>

            { inputError && <Error>{inputError}</Error> }        

            <Repositories>
                {repositories.map(repository => (
                    <Link key={repository.full_name} to={`/repositories/${repository.full_name}`}>
                        <img src={repository.owner.avatar_url} />
                        <div> 
                            <strong>{repository.full_name}</strong>
                            <p>{repository.description}</p>
                        </div>
                        <FiChevronRight size={20} />
                    </Link>          
                )) }     
            </Repositories>
        </>
    );
};

export default Dashboard;