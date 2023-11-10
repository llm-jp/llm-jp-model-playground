import React, { useCallback, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import Textarea from '../components/Textarea';
import ButtonIcon from '../components/ButtonIcon';
import RowItem from '../components/RowItem';
import useChatApi from '../hooks/useChatApi';
import { SelectField, SliderField } from '@aws-amplify/ui-react';
import { create } from 'zustand';
import { UnrecordedMessage } from 'generative-ai-use-cases-jp';
import { PiMinusCircle, PiPlusCircle } from 'react-icons/pi';
import useModels from '../hooks/useModel';

type StateType = {
  loading: boolean;
  setLoading: (s: boolean) => void;
  variant: string;
  setVariant: (s: string) => void;
  system: string;
  setSystem: (s: string) => void;
  messages: UnrecordedMessage[];
  setMessages: (s: UnrecordedMessage[]) => void;
  maxNewTokens: number;
  setMaxNewTokens: (s: number) => void;
  temperature: number;
  setTemperature: (s: number) => void;
  repetitionPenalty: number;
  setRepetitionPenalty: (s: number) => void;
  topP: number;
  setTopP: (s: number) => void;
  clear: () => void;
};

const usePlaygroundPageState = create<StateType>((set) => {
  const INIT_STATE = {
    loading: false,
    variant: '',
    system: '以下の質問に答えなさい。',
    messages: [
      { role: 'user', content: '日本で一番高い山は？' },
    ] as UnrecordedMessage[],
    maxNewTokens: 256,
    temperature: 0.7,
    repetitionPenalty: 1.05,
    topP: 0.99,
  };
  return {
    ...INIT_STATE,
    setLoading: (s: boolean) => {
      set(() => ({
        loading: s,
      }));
    },
    setVariant: (s: string) => {
      set(() => ({
        variant: s,
      }));
    },
    setSystem: (s: string) => {
      set(() => ({
        system: s,
      }));
    },
    setMessages: (s: UnrecordedMessage[]) => {
      set(() => ({
        messages: s,
      }));
    },
    setMaxNewTokens: (s: number) => {
      set(() => ({
        maxNewTokens: s,
      }));
    },
    setTemperature: (s: number) => {
      set(() => ({
        temperature: s,
      }));
    },
    setRepetitionPenalty: (s: number) => {
      set(() => ({
        repetitionPenalty: s,
      }));
    },
    setTopP: (s: number) => {
      set(() => ({
        topP: s,
      }));
    },
    clear: () => {
      set(INIT_STATE);
    },
  };
});

const ChatPlaygroundPage: React.FC = () => {
  const {
    loading,
    setLoading,
    variant,
    setVariant,
    system,
    setSystem,
    messages,
    setMessages,
    maxNewTokens,
    setMaxNewTokens,
    temperature,
    setTemperature,
    repetitionPenalty,
    setRepetitionPenalty,
    topP,
    setTopP,
    clear,
  } = usePlaygroundPageState();
  const { state } = useLocation();
  const { predictStream } = useChatApi();
  const { models, generatePrompt, processOutput } = useModels();

  const disabledExec = useMemo(() => {
    return loading;
  }, [loading]);

  useEffect(() => {
    if (state !== null) {
      setSystem(state.system || system);
      setMessages(state.messages || messages);
    }
    setVariant(models[0].name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const getGeneratedText = async (
    _system: string,
    _messages: UnrecordedMessage[],
    _maxNewTokens: number,
    _temperature: number,
    _repetitionPenalty: number,
    _topP: number,
    _variant: string
  ) => {
    setLoading(true);
    const stream = predictStream({
      inputs: generatePrompt(
        [{ role: 'system', content: _system }, ..._messages],
        _variant
      ),
      params: {
        max_new_tokens: _maxNewTokens,
        temperature: _temperature,
        repetition_penalty: _repetitionPenalty,
        top_p: _topP,
        variant: _variant,
      },
    });

    _messages.push({ role: 'assistant', content: '' });
    setMessages(_messages);

    // Assistant の発言を更新
    for await (const chunk of stream) {
      _messages[_messages.length - 1].content += processOutput(
        chunk.trim(),
        _variant
      );
      setMessages(_messages);
    }

    _messages.push({ role: 'user', content: '' });
    setMessages(_messages);

    setLoading(false);
  };

  // 実行
  const onClickExec = useCallback(() => {
    if (loading) return;
    getGeneratedText(
      system,
      messages,
      maxNewTokens,
      temperature,
      repetitionPenalty,
      topP,
      variant
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    loading,
    system,
    messages,
    maxNewTokens,
    temperature,
    repetitionPenalty,
    topP,
    variant,
  ]);

  // メッセージの削除
  const onRemoveMessage = useCallback(
    (idx: number) => {
      if (loading) return;
      messages.splice(idx, 1);
      setMessages(messages);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [messages, loading]
  );

  // メッセージの追加
  const onAddMessage = useCallback(
    () => {
      if (loading) return;
      const _role = messages.at(-1)?.role === 'user' ? 'assistant' : 'user';
      setMessages([...messages, { role: _role, content: '' }]);
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [messages, loading]
  );

  // リセット
  const onClickClear = useCallback(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid grid-cols-12">
      <div className="invisible col-span-12 my-0 flex h-0 items-center justify-center text-xl font-semibold lg:visible lg:my-5 lg:h-min">
        Playground
      </div>
      <div className="col-span-12 col-start-1 mx-2 lg:col-span-10 lg:col-start-2 xl:col-span-10 xl:col-start-2">
        <Card label="Playground">
          <div className="lg:flex">
            <div className="grow p-2">
              <div className="w-full py-2">
                <SelectField
                  label="モデル"
                  labelHidden
                  value={variant}
                  onChange={(e) => setVariant(e.target.value)}>
                  {models.map((model) => (
                    <option key={model.name} value={model.name}>
                      {model.name}
                    </option>
                  ))}
                </SelectField>
              </div>
              <div className="flex w-full items-center">
                <RowItem className="w-24">システム</RowItem>
                <div className="grow">
                  <Textarea
                    placeholder="システムプロンプト"
                    value={system}
                    onChange={setSystem}
                    maxHeight={-1}
                  />
                </div>
              </div>
              <div>
                {messages.map((message, idx) => (
                  <div className="flex items-center" key={idx}>
                    <RowItem className="w-24">
                      {message.role === 'user' ? 'ユーザー' : 'アシスタント'}
                    </RowItem>
                    <div className="grow">
                      <Textarea
                        className="grow"
                        placeholder={`${
                          message.role === 'user' ? 'ユーザー' : 'アシスタント'
                        } のメッセージ`}
                        value={message.content}
                        onChange={(s: string) => {
                          messages[idx].content = s;
                          setMessages(messages);
                        }}
                        maxHeight={-1}
                      />
                    </div>
                    <RowItem>
                      <ButtonIcon onClick={() => onRemoveMessage(idx)}>
                        <PiMinusCircle />
                      </ButtonIcon>
                    </RowItem>
                  </div>
                ))}
              </div>
              <Button outlined onClick={() => onAddMessage()}>
                <PiPlusCircle />
                メッセージの追加
              </Button>
            </div>
            <div>
              <div className="p-2">
                <SliderField
                  label="Temperature"
                  value={temperature}
                  onChange={setTemperature}
                  min={0.01}
                  max={2}
                  step={0.01}></SliderField>
                <SliderField
                  label="Max New Tokens"
                  value={maxNewTokens}
                  onChange={setMaxNewTokens}
                  min={1}
                  max={2048}
                  step={1}></SliderField>
                <SliderField
                  label="Repetition Penalty"
                  value={repetitionPenalty}
                  onChange={setRepetitionPenalty}
                  min={1.0}
                  max={2.0}
                  step={0.01}></SliderField>
                <SliderField
                  label="Top P"
                  value={topP}
                  onChange={setTopP}
                  min={0.01}
                  max={0.99}
                  step={0.01}></SliderField>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button outlined onClick={onClickClear} disabled={disabledExec}>
              クリア
            </Button>

            <Button disabled={disabledExec} onClick={onClickExec}>
              実行
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatPlaygroundPage;
